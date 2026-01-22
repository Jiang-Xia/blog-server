-- myblog.category definition

CREATE TABLE `category` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `uid` int NOT NULL,
  `label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.`collect` definition

CREATE TABLE `collect` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `articleId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `uid` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.dept definition

CREATE TABLE `dept` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自身id',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deptName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门名称',
  `deptCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门编码',
  `parentId` int NOT NULL DEFAULT '0' COMMENT '父级部门ID',
  `leaderId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '部门负责人ID',
  `leaderName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '部门负责人姓名',
  `orderNum` int NOT NULL DEFAULT '0' COMMENT '部门排序',
  `status` int NOT NULL DEFAULT '1' COMMENT '部门状态',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '部门描述',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_d71a8c6d61bfbada1b9a8e6132` (`deptCode`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='部门表';


-- myblog.file definition

CREATE TABLE `file` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `pid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `isFolder` tinyint NOT NULL DEFAULT '0',
  `originalname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `size` int NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.link definition

CREATE TABLE `link` (
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id` int NOT NULL AUTO_INCREMENT,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `desp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `agreed` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.menu definition

CREATE TABLE `menu` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `pid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `order` int NOT NULL DEFAULT '1',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `locale` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `requiresAuth` tinyint NOT NULL DEFAULT '1',
  `filePath` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `isDelete` tinyint NOT NULL DEFAULT '0',
  `menuCnName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.msgboard definition

CREATE TABLE `msgboard` (
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `eamil` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `comment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `system` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `browser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `respondent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `imgUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pId` int NOT NULL DEFAULT '0',
  `replyId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1326 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.my_file definition

CREATE TABLE `my_file` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.privilege definition

CREATE TABLE `privilege` (
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `privilegeName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '权限名称',
  `privilegeCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '权限识别码',
  `privilegePage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '所属页面(菜单id)',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自身id',
  `isVisible` tinyint NOT NULL DEFAULT '1' COMMENT '是否可见',
  `pathPattern` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '路径模式，如 /api/users/:id',
  `httpMethod` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'HTTP方法，*表示全部',
  `isPublic` tinyint NOT NULL DEFAULT '0' COMMENT '是否公开接口',
  `requireOwnership` tinyint NOT NULL DEFAULT '0' COMMENT '是否需要检查资源所有权',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='权限表';


-- myblog.reply definition

CREATE TABLE `reply` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `parentId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `replyUid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `uid` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.`role` definition

CREATE TABLE `role` (
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `roleName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色名',
  `roleDesc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色描述',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自身id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='角色表';


-- myblog.tag definition

CREATE TABLE `tag` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `uid` int NOT NULL,
  `label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.`user` definition

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `isDelete` tinyint NOT NULL DEFAULT '0',
  `version` int NOT NULL,
  `role` enum('super','admin','author') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'author',
  `status` enum('locked','active') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active',
  `nickname` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mobile` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `salt` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `intro` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `homepage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `githubId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `deptId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.article definition

CREATE TABLE `article` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `uTime` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `uid` int NOT NULL,
  `isDelete` tinyint NOT NULL DEFAULT '0',
  `topping` tinyint NOT NULL DEFAULT '0',
  `version` int NOT NULL,
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cover` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `likes` int NOT NULL DEFAULT '0',
  `views` int NOT NULL DEFAULT '0',
  `status` enum('draft','publish') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'publish',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `contentHtml` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `useArticles` int DEFAULT NULL,
  `articles` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_61ae80cb2a104883f07da6b90e9` (`useArticles`),
  KEY `FK_0845fb04306c6dacf1c847cb953` (`articles`),
  CONSTRAINT `FK_0845fb04306c6dacf1c847cb953` FOREIGN KEY (`articles`) REFERENCES `category` (`id`),
  CONSTRAINT `FK_61ae80cb2a104883f07da6b90e9` FOREIGN KEY (`useArticles`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.article_tags_tag definition

CREATE TABLE `article_tags_tag` (
  `articleId` int NOT NULL,
  `tagId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`articleId`,`tagId`),
  KEY `IDX_9b7dd28292e2799512cd70bfd8` (`articleId`),
  KEY `IDX_5fee2a10f8d6688bd2f2c50f15` (`tagId`),
  CONSTRAINT `FK_5fee2a10f8d6688bd2f2c50f15e` FOREIGN KEY (`tagId`) REFERENCES `tag` (`id`),
  CONSTRAINT `FK_9b7dd28292e2799512cd70bfd81` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.comment definition

CREATE TABLE `comment` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `uid` int NOT NULL,
  `userId` int DEFAULT NULL,
  `articleId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_c0354a9a009d3bb45a08655ce3b` (`userId`),
  KEY `FK_c20404221e5c125a581a0d90c0e` (`articleId`),
  CONSTRAINT `FK_c0354a9a009d3bb45a08655ce3b` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_c20404221e5c125a581a0d90c0e` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.`like` definition

CREATE TABLE `like` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `articleId` int NOT NULL,
  `uid` int NOT NULL DEFAULT '-999',
  `ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `status` enum('1','0') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a95ce350aee91167d8a1cefeb97` (`articleId`),
  CONSTRAINT `FK_a95ce350aee91167d8a1cefeb97` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.role_menus_menu definition

CREATE TABLE `role_menus_menu` (
  `roleId` int NOT NULL,
  `menuId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`roleId`,`menuId`),
  KEY `IDX_eec9c5cb17157b2294fd9f0edb` (`roleId`),
  KEY `IDX_f1adc6be166630ee2476d7bbf0` (`menuId`),
  CONSTRAINT `FK_eec9c5cb17157b2294fd9f0edbf` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_f1adc6be166630ee2476d7bbf09` FOREIGN KEY (`menuId`) REFERENCES `menu` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.role_privileges_privilege definition

CREATE TABLE `role_privileges_privilege` (
  `roleId` int NOT NULL,
  `privilegeId` int NOT NULL,
  PRIMARY KEY (`roleId`,`privilegeId`),
  KEY `IDX_d11ab7c8589ca17646c5345fb7` (`roleId`),
  KEY `IDX_e04315305e9b12cc7e18bda6ef` (`privilegeId`),
  CONSTRAINT `FK_d11ab7c8589ca17646c5345fb7f` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_e04315305e9b12cc7e18bda6ef8` FOREIGN KEY (`privilegeId`) REFERENCES `privilege` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.role_users_user definition

CREATE TABLE `role_users_user` (
  `userId` int NOT NULL,
  `roleId` int NOT NULL,
  PRIMARY KEY (`userId`,`roleId`),
  KEY `IDX_a88fcb405b56bf2e2646e9d479` (`userId`),
  KEY `IDX_ed6edac7184b013d4bd58d60e5` (`roleId`),
  CONSTRAINT `FK_a88fcb405b56bf2e2646e9d4797` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_ed6edac7184b013d4bd58d60e54` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;NGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 43.139.16.164    Database: myblog
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `role_privileges_privilege`
--

LOCK TABLES `role_privileges_privilege` WRITE;
/*!40000 ALTER TABLE `role_privileges_privilege` DISABLE KEYS */;
INSERT INTO `role_privileges_privilege` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16),(1,17),(1,18),(1,19),(1,20),(1,21),(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),(1,29),(1,30),(1,31),(1,32),(1,33),(1,34),(1,35),(1,36),(1,37),(1,38),(1,39),(1,40),(1,41),(1,42),(1,43),(1,44),(1,45),(1,46),(1,47),(1,48),(1,49),(1,50),(1,51),(1,52),(1,53),(1,54),(1,55),(1,56),(1,57),(1,58),(1,59),(1,60),(1,61),(1,62),(1,63),(1,64),(1,65),(1,66),(1,67),(1,68),(1,69),(1,70),(1,71),(1,72),(1,73),(1,76),(1,77),(1,78),(1,79),(1,80),(1,81),(1,82),(1,83),(1,84),(1,85),(1,86),(1,87),(1,88),(1,89),(1,90),(1,91),(1,92),(1,93),(1,94),(1,95),(1,96),(1,97),(1,98),(1,99),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(2,12),(2,13),(2,14),(2,15),(2,17),(2,18),(2,19),(2,20),(2,21),(2,22),(2,23),(2,24),(2,25),(2,26),(2,27),(2,28),(2,29),(2,30),(2,31),(2,32),(2,33),(2,34),(2,35),(2,36),(2,37),(2,38),(2,39),(2,40),(2,41),(2,42),(2,43),(2,44),(2,45),(2,46),(2,47),(2,48),(2,49),(2,50),(2,51),(2,52),(2,53),(2,54),(2,55),(2,56),(2,57),(2,58),(2,59),(2,60),(2,61),(2,62),(2,63),(2,64),(2,65),(2,66),(2,67),(2,68),(2,69),(2,70),(2,71),(2,72),(2,73),(2,76),(2,77),(2,95),(2,96),(2,97),(2,98),(2,99),(3,1),(3,22),(3,23),(3,24),(3,25),(3,26),(3,27),(3,28),(3,29),(3,30),(3,31),(3,32),(3,50),(3,51),(3,52),(3,53);
/*!40000 ALTER TABLE `role_privileges_privilege` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES ('p10000','0','/dashboard','Dashboard',0,'icon-dashboard','menu.server.dashboard',1,'dashboard',0,NULL),('p100000','0','public','public',1,'','',1,'',0,'公共接口'),('p100001','p100000','pay','pay',1,'','',1,'',0,'交易接口'),('p10001','p10000','/dashboard/workplace','Workplace',1,'icon-liebiao2','menu.server.workplace',1,'workplace',0,NULL),('p188880','0','/system','System',188,'icon-guanlishezhi','menu.server.system',1,'system',0,NULL),('p188881','p188880','/system/userManage','UserManage',188,'icon-yonghushezhi','menu.server.userManage',1,'UserManage',0,NULL),('p188882','p188880','/system/menuManage','MenuManage',188,'icon-fenlei','menu.server.menuManage',1,'MenuManage',0,NULL),('p188883','p188880','/systeam/roleManage','RoleManage',3,'icon-fenlei','menu.server.roleManage',1,'RoleManage',0,'角色管理'),('p188884','p188880','/systeam/privilegeManage','PrivilegeManage',4,'icon-fenlei','menu.server.privilegeManage',1,'PrivilegeManage',0,'权限管理'),('p188885','p188880','/systeam/deptManage','DeptManage',4,'icon-fenlei','menu.server.deptManage',1,'DeptManage',0,'部门管理'),('p20000','0','/article','Article',1,'icon-biji','menu.server.article',1,'article',0,NULL),('p20001','p20000','/article/list','ArticleList',1,'icon-liebiao2','menu.server.articleList',1,'ArticleList',0,NULL),('p20002','p20000','/article/edit','ArticleEdit',1,'icon-liebiao2','menu.server.articleEdit',1,'ArticleEdit',0,NULL),('p30000','0','/category','Category',2,'icon-fenlei1','menu.server.category',1,'category',0,NULL),('p30001','p30000','/category/list','CategoryList',1,'icon-liebiao2','menu.server.categoryList',1,'categoryList',0,NULL),('p40000','0','/tag','Tag',2,'icon-biaoqian','menu.server.tag',1,'Tag',0,NULL),('p40001','p40000','/tag/list','TagList',1,'icon-liebiao2','menu.server.tagList',1,'TagList',0,NULL),('p50000','0','/user','User',2,'icon-gerenzhongxin1','menu.server.user',1,'User',0,NULL),('p50001','p50000','/user/set','UserSet',1,'icon-liebiao2','menu.server.userSet',1,'UserSet',0,NULL),('p60000','0','/link','Link',2,'icon-lianjie','menu.server.link',1,'Link',0,NULL),('p60001','p60000','link/list','LinkList',1,'icon-liebiao2','menu.server.linkList',1,'LinkList',0,NULL),('p70000','0','/msgboard','Msgboard',2,'icon-liuyanban','menu.server.msgboard',1,'Msgboard',0,NULL),('p70001','p70000','list','MsgboardList',1,'icon-kefu','menu.server.msgboardList',1,'MsgboardList',0,NULL),('p800000','0','resources','Resources',2,'icon-wenjianjia1','menu.server.resource',1,'resources',0,NULL),('p800001','p800000','resources/list','ResourceList',1,'icon-fenlei','menu.server.resourceList',1,'resourceList',0,NULL),('p900000','0','/comment','Comment',6,'icon-liuyanban','menu.server.comment',1,'comment',0,NULL),('p900001','p900000','/comment/list','CommentList',1,'icon-fenlei','menu.server.commentList',1,'commentList',0,NULL);
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `privilege`
--

LOCK TABLES `privilege` WRITE;
/*!40000 ALTER TABLE `privilege` DISABLE KEYS */;
INSERT INTO `privilege` VALUES ('2026-01-16 17:42:39.170009','2026-01-16 17:43:45.623110','获取菜单列表','menu:list','p188882',1,1,'/admin/menu','GET',1,0,'获取菜单列表权限'),('2026-01-16 17:42:39.174389','2026-01-16 17:42:39.174389','创建菜单','menu:create','p188882',2,1,'/admin/menu','POST',0,0,'创建菜单权限'),('2026-01-16 17:42:39.177354','2026-01-16 17:42:39.177354','更新菜单','menu:update','p188882',3,1,'/admin/menu','PATCH',0,0,'更新菜单权限'),('2026-01-16 17:42:39.181565','2026-01-16 17:42:39.181565','获取菜单详情','menu:detail','p188882',4,1,'/admin/menu/detail','GET',0,0,'获取菜单详情权限'),('2026-01-16 17:42:39.185610','2026-01-16 17:42:39.185610','删除菜单','menu:delete','p188882',5,1,'/admin/menu','DELETE',0,0,'删除菜单权限'),('2026-01-16 17:42:39.191042','2026-01-16 17:42:39.191042','用户登录','user:login','p188881',6,1,'/user/login','POST',1,0,'用户登录权限'),('2026-01-16 17:42:39.195042','2026-01-16 17:42:39.195042','用户注册','user:register','p188881',7,1,'/user/register','POST',1,0,'用户注册权限'),('2026-01-16 17:42:39.198897','2026-01-16 17:42:39.198897','获取验证码','user:auth-code','p188881',8,1,'/user/authCode','GET',1,0,'获取验证码权限'),('2026-01-16 17:42:39.203023','2026-01-16 17:45:55.804198','刷新token','user:refresh','p188881',9,0,'/user/refresh','GET',1,0,'刷新token权限'),('2026-01-16 17:42:39.206003','2026-01-16 17:45:55.809721','获取用户信息','user:info','p188881',10,1,'/user/info','GET',1,0,'获取用户信息权限'),('2026-01-16 17:42:39.208776','2026-01-16 17:42:39.208776','获取用户列表','user:list','p188881',11,1,'/user/list','POST',0,0,'获取用户列表权限'),('2026-01-16 17:42:39.211547','2026-01-16 17:42:39.211547','更新用户信息','user:edit','p188881',12,1,'/user/edit','PATCH',0,0,'更新用户信息权限'),('2026-01-16 17:42:39.215209','2026-01-16 17:42:39.215209','更新用户状态','user:status','p188881',13,1,'/user/status','PATCH',0,0,'更新用户状态权限'),('2026-01-16 17:42:39.218954','2026-01-16 17:42:39.218954','更新密码','user:password','p188881',14,1,'/user/password','PATCH',0,0,'更新密码权限'),('2026-01-16 17:42:39.222774','2026-01-16 17:42:39.222774','重置密码','user:resetPassword','p188881',15,1,'/user/resetPassword','POST',0,0,'重置密码权限'),('2026-01-16 17:42:39.226564','2026-01-16 17:42:39.226564','删除用户','user:delete','p188881',16,1,'/user','DELETE',0,0,'删除用户权限'),('2026-01-16 17:42:39.230185','2026-01-16 17:42:39.230185','发送邮箱验证码','user:email-send-code','p188881',17,1,'/user/email/sendCode','POST',1,0,'发送邮箱验证码权限'),('2026-01-16 17:42:39.233985','2026-01-16 17:42:39.233985','邮箱注册','user:email-register','p188881',18,1,'/user/email/register','POST',1,0,'邮箱注册权限'),('2026-01-16 17:42:39.236858','2026-01-16 17:42:39.236858','邮箱登录','user:email-login','p188881',19,1,'/user/email/login','POST',1,0,'邮箱登录权限'),('2026-01-16 17:42:39.240116','2026-01-16 17:45:55.814200','GitHub认证','user:github-auth','p188881',20,0,'/user/auth/github','GET',1,0,'GitHub认证权限'),('2026-01-16 17:42:39.243376','2026-01-16 17:45:55.818542','GitHub授权回调','user:github-auth-redirect','p188881',21,0,'/user/auth/github/callback','GET',1,0,'GitHub授权回调权限'),('2026-01-16 17:42:39.246629','2026-01-19 15:41:48.029688','获取文章列表','article:list','p20001',22,1,'/article/list','POST',1,0,'获取文章列表权限'),('2026-01-16 17:42:39.250506','2026-01-19 15:41:48.034200','获取文章详情','article:info','p20001',23,1,'/article/info','GET',1,0,'获取文章详情权限'),('2026-01-16 17:42:39.253821','2026-01-16 17:42:39.253821','创建文章','article:create','p20001',24,1,'/article/create','POST',0,0,'创建文章权限'),('2026-01-16 17:42:39.257936','2026-01-16 17:42:39.257936','编辑文章','article:edit','p20002',25,1,'/article/edit','POST',0,0,'编辑文章权限'),('2026-01-16 17:42:39.262052','2026-01-16 17:42:39.262052','删除文章','article:delete','p20001',26,1,'/article/delete','DELETE',0,0,'删除文章权限'),('2026-01-16 17:42:39.265090','2026-01-19 15:41:48.038902','更新文章访问量','article:views','p20001',27,0,'/article/views','POST',1,0,'更新文章访问量权限'),('2026-01-16 17:42:39.268932','2026-01-19 15:41:48.043136','更新文章点赞量','article:likes','p20001',28,0,'/article/likes','POST',1,0,'更新文章点赞量权限'),('2026-01-16 17:42:39.273697','2026-01-16 17:42:39.273697','禁用文章','article:disabled','p20001',29,1,'/article/disabled','PATCH',0,0,'禁用文章权限'),('2026-01-16 17:42:39.277425','2026-01-16 17:42:39.277425','置顶文章','article:topping','p20001',30,1,'/article/topping','PATCH',0,0,'置顶文章权限'),('2026-01-16 17:42:39.281201','2026-01-19 15:41:48.046893','获取文章归档','article:archives','p20001',31,1,'/article/archives','GET',1,0,'获取文章归档权限'),('2026-01-16 17:42:39.285209','2026-01-19 15:41:48.052039','获取文章统计','article:statistics','p20001',32,1,'/article/statistics','GET',1,0,'获取文章统计权限'),('2026-01-16 17:42:39.288462','2026-01-19 15:38:33.230856','获取分类列表','category:list','p30001',33,1,'/category','GET',1,0,'获取分类列表权限'),('2026-01-16 17:42:39.292259','2026-01-16 17:42:39.292259','创建分类','category:create','p30001',34,1,'/category','POST',0,0,'创建分类权限'),('2026-01-16 17:42:39.295132','2026-01-16 17:42:39.295132','获取分类详情','category:detail','p30001',35,1,'/category/:id','GET',0,0,'获取分类详情权限'),('2026-01-16 17:42:39.298878','2026-01-16 17:42:39.298878','更新分类','category:update','p30001',36,1,'/category/:id','PATCH',0,0,'更新分类权限'),('2026-01-16 17:42:39.301747','2026-01-16 17:42:39.301747','删除分类','category:delete','p30001',37,1,'/category/:id','DELETE',0,0,'删除分类权限'),('2026-01-16 17:42:39.304661','2026-01-19 15:37:48.951393','获取标签列表','tag:list','p40001',38,1,'/tag','GET',1,0,'获取标签列表权限'),('2026-01-16 17:42:39.307390','2026-01-16 17:42:39.307390','创建标签','tag:create','p40001',39,1,'/tag','POST',0,0,'创建标签权限'),('2026-01-16 17:42:39.311171','2026-01-16 17:42:39.311171','获取标签详情','tag:detail','p40001',40,1,'/tag/:id','GET',0,0,'获取标签详情权限'),('2026-01-16 17:42:39.314045','2026-01-19 15:37:48.957088','获取标签文章','tag:article','p40001',41,1,'/tag/:id/article','GET',1,0,'获取标签文章权限'),('2026-01-16 17:42:39.317902','2026-01-16 17:42:39.317902','更新标签','tag:update','p40001',42,1,'/tag/:id','PATCH',0,0,'更新标签权限'),('2026-01-16 17:42:39.320905','2026-01-16 17:42:39.320905','删除标签','tag:delete','p40001',43,1,'/tag/:id','DELETE',0,0,'删除标签权限'),('2026-01-16 17:42:39.323938','2026-01-19 15:47:06.123179','创建评论','comment:create','p900001',44,1,'/comment/create','POST',1,0,'创建评论权限'),('2026-01-16 17:42:39.326878','2026-01-16 17:42:39.326878','删除评论','comment:delete','p900001',45,1,'/comment/delete','DELETE',0,0,'删除评论权限'),('2026-01-16 17:42:39.330789','2026-01-19 15:37:15.278176','获取文章评论','comment:find-all','p900001',46,1,'/comment/findAll','GET',1,0,'获取文章评论权限'),('2026-01-16 17:42:39.337352','2026-01-19 15:47:06.128346','创建回复','reply:create','p900001',47,1,'/reply/create','POST',1,0,'创建回复权限'),('2026-01-16 17:42:39.341416','2026-01-19 15:47:06.133890','删除回复','reply:delete','p900001',48,1,'/reply/delete','DELETE',1,0,'删除回复权限'),('2026-01-16 17:42:39.344393','2026-01-16 17:42:39.344393','获取文章回复','reply:find-all','p900001',49,1,'/reply/findAll','GET',0,0,'获取文章回复权限'),('2026-01-16 17:42:39.348734','2026-01-19 15:47:06.139422','更新点赞','like:update','p20001',50,1,'/like','POST',1,0,'更新点赞权限'),('2026-01-16 17:42:39.351856','2026-01-19 15:47:06.145133','收藏文章','collect:add','p20001',51,1,'/collect/:id','GET',1,0,'收藏文章权限'),('2026-01-16 17:42:39.356122','2026-01-19 15:47:06.150718','取消收藏文章','collect:cancel','p20001',52,1,'/collect/:id','DELETE',1,0,'取消收藏文章权限'),('2026-01-16 17:42:39.359915','2026-01-19 15:47:06.156107','获取收藏文章','collect:find-all','p20001',53,1,'/collect','GET',1,0,'获取收藏文章权限'),('2026-01-16 17:42:39.363098','2026-01-19 15:47:06.161714','创建留言','msgboard:create','p70001',54,1,'/msgboard','POST',1,0,'创建留言权限'),('2026-01-16 17:42:39.365962','2026-01-19 15:47:06.167713','获取留言列表','msgboard:list','p70001',55,1,'/msgboard','GET',1,0,'获取留言列表权限'),('2026-01-16 17:42:39.368770','2026-01-16 17:42:39.368770','删除留言','msgboard:delete','p70001',56,1,'/msgboard/delete','POST',0,0,'删除留言权限'),('2026-01-16 17:42:39.371743','2026-01-19 15:47:06.173179','上传大文件','file:upload-big','p800001',57,1,'/file/uploadBigFile','POST',1,0,'上传大文件权限'),('2026-01-16 17:42:39.375492','2026-01-16 17:42:39.375492','获取每日图片','resources:daily-img','p800001',58,1,'/resources/daily-img','GET',1,0,'获取每日图片权限'),('2026-01-16 17:42:39.378615','2026-01-16 17:42:39.378615','获取百度统计','resources:baidu-tongji','p800001',59,1,'/resources/baidutongji','GET',1,0,'获取百度统计权限'),('2026-01-16 17:42:39.381614','2026-01-16 17:42:39.381614','获取天气信息','resources:weather','p800001',60,1,'/resources/weather','GET',1,0,'获取天气信息权限'),('2026-01-16 17:42:39.385347','2026-01-16 17:42:39.385347','上传文件','resources:upload-file','p800001',61,1,'/resources/uploadFile','POST',0,0,'上传文件权限'),('2026-01-16 17:42:39.389051','2026-01-16 17:42:39.389051','获取所有文件','resources:files-list','p800001',62,1,'/resources/files','GET',0,0,'获取所有文件权限'),('2026-01-16 17:42:39.392908','2026-01-16 17:42:39.392908','获取指定文件','resources:file-detail','p800001',63,0,'/resources/file:id','GET',0,0,'获取指定文件权限'),('2026-01-16 17:42:39.396925','2026-01-16 17:42:39.396925','删除文件','resources:file-delete','p800001',64,1,'/resources/file','DELETE',0,0,'删除文件权限'),('2026-01-16 17:42:39.400612','2026-01-16 17:42:39.400612','增加文件夹','resources:folder-add','p800001',65,1,'/resources/folder','POST',0,0,'增加文件夹权限'),('2026-01-16 17:42:39.404299','2026-01-16 17:42:39.404299','更新文件','resources:file-update','p800001',66,1,'/resources/file','PATCH',0,0,'更新文件权限'),('2026-01-16 17:42:39.408255','2026-01-16 18:14:32.469562','创建交易','pay:trade-create','p100001',67,1,'/pay/trade/create','POST',1,0,'创建交易权限'),('2026-01-16 17:42:39.411289','2026-01-16 18:14:32.475275','查询交易','pay:trade-query','p100001',68,1,'/pay/trade/query','GET',1,0,'查询交易权限'),('2026-01-16 17:42:39.415045','2026-01-16 18:14:32.478927','退款交易','pay:trade-refund','p100001',69,1,'/pay/trade/refund','POST',1,0,'退款交易权限'),('2026-01-16 17:42:39.418712','2026-01-16 18:14:32.482509','关闭交易','pay:trade-close','p100001',70,1,'/pay/trade/close','POST',1,0,'关闭交易权限'),('2026-01-16 17:42:39.422616','2026-01-16 18:14:32.487104','获取OpenId','pay:get-openid','p100001',71,1,'/pay/openid','POST',1,0,'获取OpenId权限'),('2026-01-16 17:42:39.426705','2026-01-16 18:14:32.491785','生成H5小程序链接','pay:h5-open-mini','p100001',72,1,'/pay/h5-open-mini','POST',1,0,'生成H5小程序链接权限'),('2026-01-16 17:42:39.430738','2026-01-16 17:58:56.804071','AI流请求','pub:ai-stream','p100000',73,1,'/pub/ai-stream','POST',1,0,'AI流请求权限'),('2026-01-16 17:42:39.434664','2026-01-16 18:09:56.560398','获取验证码','captcha:get','p000001',74,1,'/captcha','GET',1,0,'获取验证码权限'),('2026-01-16 17:42:39.438540','2026-01-19 15:48:46.611872','验证验证码','captcha:verify','p000001',75,1,'/captcha/verify','POST',1,0,'验证验证码权限'),('2026-01-16 17:42:39.442987','2026-01-16 18:21:15.082978','获取首页','app:home','p100000',76,1,'/','GET',1,0,'获取首页权限'),('2026-01-16 17:42:39.449533','2026-01-16 18:21:15.088555','重定向地址','app:redirect','p100000',77,0,'/redirect','GET',1,0,'重定向地址权限'),('2026-01-16 17:42:39.450000','2026-01-16 17:42:39.450000','获取菜单权限树形数据','role:menu-privilege-tree','p188883',78,1,'/role/menu-privilege-tree','GET',0,0,'获取菜单权限树形数据权限'),('2026-01-16 17:42:39.451000','2026-01-16 17:42:39.451000','创建角色','role:create','p188883',79,1,'/role','POST',0,0,'创建角色权限'),('2026-01-16 17:42:39.452000','2026-01-16 17:42:39.452000','获取角色列表','role:list','p188883',80,1,'/role','GET',0,0,'获取角色列表权限'),('2026-01-16 17:42:39.453000','2026-01-16 17:42:39.453000','获取角色详情','role:detail','p188883',81,1,'/role/:id','GET',0,0,'获取角色详情权限'),('2026-01-16 17:42:39.454000','2026-01-16 17:42:39.454000','更新角色','role:update','p188883',82,1,'/role/:id','PATCH',0,0,'更新角色权限'),('2026-01-16 17:42:39.455000','2026-01-16 17:42:39.455000','删除角色','role:delete','p188883',83,1,'/role/:id','DELETE',0,0,'删除角色权限'),('2026-01-16 17:42:39.456000','2026-01-16 18:18:15.925727','创建部门','dept:create','p188885',84,1,'/dept','POST',0,0,'创建部门权限'),('2026-01-16 17:42:39.457000','2026-01-16 18:18:15.931233','获取部门列表','dept:list','p188885',85,1,'/dept','GET',0,0,'获取部门列表权限'),('2026-01-16 17:42:39.458000','2026-01-16 18:18:15.936369','获取部门树形数据','dept:tree','p188885',86,1,'/dept/tree','GET',0,0,'获取部门树形数据权限'),('2026-01-16 17:42:39.459000','2026-01-16 18:18:15.945192','获取部门详情','dept:detail','p188885',87,1,'/dept/:id','GET',0,0,'获取部门详情权限'),('2026-01-16 17:42:39.460000','2026-01-16 18:18:15.949552','更新部门','dept:update','p188885',88,1,'/dept/:id','PATCH',0,0,'更新部门权限'),('2026-01-16 17:42:39.461000','2026-01-16 18:18:15.954633','删除部门','dept:delete','p188885',89,1,'/dept/:id','DELETE',0,0,'删除部门权限'),('2026-01-16 17:42:39.462000','2026-01-16 18:19:04.397929','创建权限','privilege:create','p188884',90,1,'/privilege','POST',0,0,'创建权限数据权限'),('2026-01-16 17:42:39.463000','2026-01-16 18:19:04.403688','获取权限列表','privilege:list','p188884',91,1,'/privilege','GET',0,0,'获取权限列表权限'),('2026-01-16 17:42:39.464000','2026-01-16 18:19:04.407932','获取权限详情','privilege:detail','p188884',92,1,'/privilege/:id','GET',0,0,'获取权限详情权限'),('2026-01-16 17:42:39.465000','2026-01-16 18:19:04.412432','更新权限','privilege:update','p188884',93,1,'/privilege/:id','PATCH',0,0,'更新权限数据权限'),('2026-01-16 17:42:39.466000','2026-01-16 18:19:04.416945','删除权限','privilege:delete','p188884',94,1,'/privilege/:id','DELETE',0,0,'删除权限数据权限'),('2026-01-19 10:00:00.000000','2026-01-19 15:53:13.373369','创建外链','link:create','p60001',95,1,'/link','POST',1,0,'创建外链权限'),('2026-01-19 10:00:00.000000','2026-01-19 10:00:00.000000','获取外链详情','link:detail','p60001',96,1,'/link/:id','GET',0,0,'获取外链详情权限'),('2026-01-19 10:00:00.000000','2026-01-19 15:32:02.877265','获取外链列表','link:list','p60001',97,1,'/link','GET',1,0,'获取外链列表权限'),('2026-01-19 10:00:00.000000','2026-01-19 10:00:00.000000','更新外链','link:update','p60001',98,1,'/link/:id','PATCH',0,0,'更新外链权限'),('2026-01-19 10:00:00.000000','2026-01-19 10:00:00.000000','删除外链','link:delete','p60001',99,1,'/link','DELETE',0,0,'删除外链权限');
/*!40000 ALTER TABLE `privilege` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES ('2026-01-16 18:23:40.865938','2026-01-16 18:23:40.865938','超级管理员','超级管理员',1),('2026-01-19 16:44:31.989441','2026-01-19 16:44:53.768081','管理员','管理员',2),('2026-01-19 11:48:49.352431','2026-01-19 16:42:44.827313','作者','作者',3);
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `role_menus_menu`
--

LOCK TABLES `role_menus_menu` WRITE;
/*!40000 ALTER TABLE `role_menus_menu` DISABLE KEYS */;
INSERT INTO `role_menus_menu` VALUES (1,'p10000'),(1,'p100000'),(1,'p100001'),(1,'p10001'),(1,'p188880'),(1,'p188881'),(1,'p188882'),(1,'p188883'),(1,'p188884'),(1,'p188885'),(1,'p20000'),(1,'p20001'),(1,'p20002'),(1,'p30000'),(1,'p30001'),(1,'p40000'),(1,'p40001'),(1,'p50000'),(1,'p50001'),(1,'p60000'),(1,'p60001'),(1,'p70000'),(1,'p70001'),(1,'p800000'),(1,'p800001'),(1,'p900000'),(1,'p900001'),(2,'p10000'),(2,'p100000'),(2,'p100001'),(2,'p10001'),(2,'p188880'),(2,'p188881'),(2,'p20000'),(2,'p20001'),(2,'p20002'),(2,'p30000'),(2,'p30001'),(2,'p40000'),(2,'p40001'),(2,'p50000'),(2,'p50001'),(2,'p60000'),(2,'p60001'),(2,'p70000'),(2,'p70001'),(2,'p800000'),(2,'p800001'),(2,'p900000'),(2,'p900001'),(3,'p10000'),(3,'p10001'),(3,'p188882'),(3,'p20000'),(3,'p20001'),(3,'p20002'),(3,'p50000'),(3,'p50001');
/*!40000 ALTER TABLE `role_menus_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `dept`
--

LOCK TABLES `dept` WRITE;
/*!40000 ALTER TABLE `dept` DISABLE KEYS */;
INSERT INTO `dept` VALUES (1,'2026-01-20 15:46:37.944585','2026-01-20 15:46:37.944585','酱的博客系统','001',0,NULL,NULL,0,1,'酱的博客系统'),(2,'2026-01-20 15:47:06.600742','2026-01-20 15:47:06.600742','管理部门','002',1,NULL,NULL,0,1,'管理部门'),(4,'2026-01-20 15:47:46.955613','2026-01-20 15:47:46.955613','作者部门','003',1,NULL,NULL,0,1,'作者部门'),(5,'2026-01-20 15:48:14.311806','2026-01-20 15:48:20.000000','系统管理员','004',1,NULL,NULL,0,1,'系统管理员');
/*!40000 ALTER TABLE `dept` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `role_users_user`
--

LOCK TABLES `role_users_user` WRITE;
/*!40000 ALTER TABLE `role_users_user` DISABLE KEYS */;
INSERT INTO `role_users_user` VALUES (1,2),(35,1),(49,3),(50,3);
/*!40000 ALTER TABLE `role_users_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-22 10:19:16
