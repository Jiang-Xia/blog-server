// src/auth/guards/permission.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { RedisService } from '../../core/redis/redis.service';
import { PrivilegeService } from '../../features/admin/system/services/privilege.service';
import { UserService } from '../../features/user/user.service';
import { getUid } from 'src/utils';

interface ApiPermission {
  id: string;
  pathPattern: string;
  httpMethod: string;
  privilegeCode: string; // 权限识别码，与数据库字段一致
  isPublic: boolean;
  requireOwnership: boolean;
}

interface UserInfo {
  id: number;
  username: string;
  roles: string[];
  roleId: number;
  isSuperAdmin?: boolean;
}

interface CacheApiMapping {
  [key: string]: ApiPermission;
}

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);
  private pathRegexCache = new Map<string, RegExp>();

  private redisService: RedisService;
  private privilegeService: PrivilegeService;
  private userService: UserService;

  // 公共路径配置（可直接访问的接口）
  // 从数据库动态获取，不再硬编码

  constructor(
    redisService: RedisService,
    privilegeService: PrivilegeService,
    userService: UserService,
  ) {
    this.redisService = redisService;
    this.privilegeService = privilegeService;
    this.userService = userService;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, path } = request;

    // 去除公共前缀
    const url = path.replace('/api/v1', '');

    this.logger.debug(`权限检查: ${method} ${url}`);

    // 1. 检查是否为公共路径
    if (await this.isPublicPath(method, url)) {
      this.logger.debug(`公共路径，跳过权限检查: ${method} ${url}`);
      return true;
    }

    // 2. 验证用户登录状态
    const uid = getUid(request.headers.authorization);
    if (!uid) {
      throw new HttpException('用户未登录', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    let user: UserInfo = { id: 0, username: '', roles: [], roleId: 0 };
    let roleId: number = 0;
    // 通过 uid 查询完整用户信息
    if (uid) {
      const fullUser = await this.userService.getUserRoleInfo(uid);
      // console.log(uid, fullUser, 'fullUser-------------->');
      if (fullUser) {
        // 将数据库中的用户信息转换为接口所需的格式
        const roles = fullUser.roles || [];
        roleId = roles[0]?.id;
        user = {
          id: fullUser.id,
          username: fullUser.username || '',
          roles: roles,
          roleId: roleId,
          isSuperAdmin: roleId === 1,
        };
        this.logger.debug(`用户登录,  roleId: ${roleId}, username: ${user.username}, uid: ${uid}`);
      }
    }
    // 3. 如果是超级管理员，直接放行, 不放行管理员角色配置全部权限
    // if (user.isSuperAdmin) {
    //   this.logger.debug(`超级管理员，直接放行: ${method} ${url}`);
    //   return true;
    // }

    // 4. 获取匹配的API权限配置（未检查用户的权限，只是检查是否配置了该接口的权限）
    const apiPermission = await this.getMatchedApiPermission(method, url);

    if (!apiPermission) {
      this.logger.warn(`接口权限未配置: ${method} ${url}`);
      throw new HttpException('接口权限未配置，请联系管理员', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 5. 检查用户权限
    const hasPermission = await this.checkUserPermission(user, apiPermission, request);

    if (!hasPermission) {
      throw new HttpException('权限不足，无法访问该资源', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return true;
  }

  /**
   * 检查是否为公共路径
   */
  private async isPublicPath(method: string, url: string): Promise<boolean> {
    // 从缓存获取公共路径配置
    const publicPathsStr = await this.redisService.get('public_api_paths');
    let publicPaths = publicPathsStr ? JSON.parse(publicPathsStr) : null;

    if (!publicPaths) {
      // 从数据库加载所有标记为公共的权限
      const privileges = await this.privilegeService['privilegeRepository'].find({
        where: { isPublic: true },
      });

      // 转换为公共路径格式
      publicPaths = privileges.map((privilege) => ({
        pattern: privilege.pathPattern,
        methods: [privilege.httpMethod],
      }));

      // 缓存公共路径配置（缓存5分钟）
      await this.redisService.set('public_api_paths', JSON.stringify(publicPaths), 5 * 60);
    }
    // 检查路径是否匹配任何公共路径
    for (const publicPath of publicPaths) {
      if (this.matchPath(url, publicPath.pattern)) {
        if (publicPath.methods.includes('*') || publicPath.methods.includes(method)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 获取匹配的全部API权限配置
   */
  private async getMatchedApiPermission(
    method: string,
    url: string,
  ): Promise<ApiPermission | null> {
    try {
      // 1. 从缓存获取所有API权限映射
      const apiMappingsStr = await this.redisService.get('api_permission_mappings');
      let apiMappings = apiMappingsStr ? JSON.parse(apiMappingsStr) : null;

      if (!apiMappings) {
        // 2. 从数据库加载API权限映射
        apiMappings = await this.loadApiPermissionsFromDatabase();

        // 3. 缓存API权限映射（缓存5分钟）
        await this.redisService.set(
          'api_permission_mappings',
          JSON.stringify(apiMappings),
          5 * 60, // 5分钟
        );
      }

      // 4. 遍历所有配置进行模式匹配
      // 优先级：精确匹配 > 路径模式匹配
      for (const key in apiMappings) {
        const permission = apiMappings[key];

        // 先检查HTTP方法
        if (permission.httpMethod !== '*' && permission.httpMethod !== method) {
          continue;
        }

        // 再检查URL路径
        if (this.matchPath(url, permission.pathPattern)) {
          return permission;
        }
      }

      return null;
    } catch (error) {
      this.logger.error('获取API权限配置失败:', error);
      return null;
    }
  }

  /**
   * 从数据库加载全部的API权限映射
   */
  private async loadApiPermissionsFromDatabase(): Promise<CacheApiMapping> {
    try {
      // 从数据库查询所有权限记录
      const privileges = await this.privilegeService['privilegeRepository'].find();

      // 转换为缓存格式
      const cacheMappings: CacheApiMapping = {};

      for (const privilege of privileges) {
        const typedPrivilege = privilege as any;
        const permission: ApiPermission = {
          id: typedPrivilege.id,
          pathPattern: privilege.pathPattern,
          httpMethod: privilege.httpMethod,
          privilegeCode: privilege.privilegeCode,
          isPublic: privilege.isPublic,
          requireOwnership: privilege.requireOwnership,
        };

        // 为每个权限创建一个唯一的标识符作为缓存键
        // 不仅基于HTTP方法和路径模式，而是基于所有权限配置
        const cacheKey = `${permission.httpMethod}:${permission.pathPattern}:${permission.privilegeCode}`;
        cacheMappings[cacheKey] = permission;
      }

      return cacheMappings;
    } catch (error) {
      this.logger.error('从数据库加载API权限失败:', error);

      // 如果数据库查询失败，返回空映射
      return {};
    }
  }

  /**
   * 路径匹配算法
   */
  private matchPath(actualPath: string, pattern: string): boolean {
    // 清理路径
    const cleanPath = actualPath.split('?')[0]; // 移除查询参数

    // 从缓存获取正则表达式
    let regex = this.pathRegexCache.get(pattern);
    if (!regex) {
      // 构建正则表达式
      // 先处理路径参数（如 :id），将其替换为捕获组
      let regexPattern = pattern;
      // 将 :param 转换为 ([^/]+)，只在路径分隔符后面才匹配参数
      regexPattern = regexPattern.replace(/:(\w+)/g, '([^/]+)');

      // 处理通配符，将单个 * 替换为 [^/]* （匹配单级路径），** 替换为 .* （匹配任意路径）
      regexPattern = regexPattern.replace(/\*\*/g, '.*'); // 双星号匹配任意路径
      regexPattern = regexPattern.replace(/\*/g, '[^/]*'); // 单星号匹配单级路径

      // 然后转义剩余的正则特殊字符（除了已被使用的括号）
      // 注意：这里不转义圆括号，因为我们已经手动添加了它们用于路径参数
      regexPattern = regexPattern.replace(/[.+?^${}|[\\]\\]/g, '\\$&');

      regex = new RegExp(`^${regexPattern}$`);
      this.pathRegexCache.set(pattern, regex);
    }
    // if (pattern === '/role/:id') {
    //   console.log('cleanPath', cleanPath);
    //   console.log('regex', regex);
    // }
    return regex.test(cleanPath);
  }

  /**
   * 检查用户权限
   */
  private async checkUserPermission(
    user: UserInfo,
    apiPermission: ApiPermission,
    request: Request,
  ): Promise<boolean> {
    try {
      // 1. 获取用户权限列表（带缓存）
      const userPermissions = await this.getUserPermissions(user.roleId);

      // 2. 检查用户是否有该权限码
      if (!userPermissions.includes(apiPermission.privilegeCode)) {
        // 使用正确的字段名
        this.logger.warn(`用户 ${user.id} 缺少权限: ${apiPermission.privilegeCode}`);
        return false;
      }

      this.logger.debug(`用户 ${user.id} 有权限访问: ${apiPermission.privilegeCode}`);
      return true;
    } catch (error) {
      this.logger.error('检查用户权限失败:', error);
      return false;
    }
  }

  /**
   * 获取用户权限列表
   */
  private async getUserPermissions(roleId: number): Promise<string[]> {
    const cacheKey = `role_permissions:${roleId}`;

    try {
      // 1. 尝试从缓存获取
      const cachedPermissionsStr = await this.redisService.get(cacheKey);
      const cachedPermissions = cachedPermissionsStr ? JSON.parse(cachedPermissionsStr) : null;

      if (cachedPermissions) {
        return cachedPermissions;
      }

      // 2. 从数据库查询用户所属角色的权限
      const permissions = await this.getUserRolePermissionsFromDatabase(roleId);

      // 3. 缓存权限（缓存2分钟）
      await this.redisService.set(cacheKey, JSON.stringify(permissions), 2 * 60);

      return permissions;
    } catch (error) {
      this.logger.error('获取用户权限失败:', error);
      // 数据库查询失败时返回空数组，避免误授权
      return [];
    }
  }

  /**
   * 从数据库查询用户所属角色的权限
   */
  private async getUserRolePermissionsFromDatabase(roleId: number): Promise<string[]> {
    try {
      const queryResult = await this.privilegeService['privilegeRepository']
        .createQueryBuilder('privilege')
        .leftJoinAndSelect('privilege.roles', 'roles')
        .where('roles.id = :roleId', { roleId })
        .getMany();
      // console.log('queryResult', queryResult);
      // 提取权限码
      const permissions = queryResult.map((item) => item.privilegeCode) || [];
      return permissions;
    } catch (error) {
      this.logger.error('查询用户权限失败:', error);
      return [];
    }
  }
}
