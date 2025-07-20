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
  `super` tinyint NOT NULL DEFAULT '1',
  `admin` tinyint NOT NULL DEFAULT '1',
  `author` tinyint NOT NULL DEFAULT '0',
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
) ENGINE=InnoDB AUTO_INCREMENT=1313 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.my_file definition

CREATE TABLE `my_file` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.privilege definition

CREATE TABLE `privilege` (
  `id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '自身id',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `value` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '权限英文名',
  `label` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '权限名',
  `menuId` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜单id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='权限表';


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
  `id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '自身id',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `value` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色英文名',
  `label` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='角色表';


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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


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
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


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


-- myblog.role_privileges_privilege definition

CREATE TABLE `role_privileges_privilege` (
  `roleId` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `privilegeId` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`roleId`,`privilegeId`),
  KEY `IDX_d11ab7c8589ca17646c5345fb7` (`roleId`),
  KEY `IDX_e04315305e9b12cc7e18bda6ef` (`privilegeId`),
  CONSTRAINT `FK_d11ab7c8589ca17646c5345fb7f` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_e04315305e9b12cc7e18bda6ef8` FOREIGN KEY (`privilegeId`) REFERENCES `privilege` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- myblog.role_users_user definition

CREATE TABLE `role_users_user` (
  `roleId` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`roleId`,`userId`),
  KEY `IDX_ed6edac7184b013d4bd58d60e5` (`roleId`),
  KEY `IDX_a88fcb405b56bf2e2646e9d479` (`userId`),
  CONSTRAINT `FK_a88fcb405b56bf2e2646e9d4797` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_ed6edac7184b013d4bd58d60e54` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p10000', '0', '/dashboard', 'Dashboard', 0, 'icon-dashboard', 'menu.server.dashboard', 1, 'dashboard', 0, 1, 1, 1);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p10001', 'p10000', '/dashboard/workplace', 'Workplace', 1, 'icon-liebiao2', 'menu.server.workplace', 1, 'workplace', 0, 1, 1, 1);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p188880', '0', '/system', 'System', 188, 'icon-guanlishezhi', 'menu.server.system', 1, 'system', 0, 1, 1, 0);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p188881', 'p188880', '/system/userManage', 'UserManage', 188, 'icon-yonghushezhi', 'menu.server.userManage', 1, 'UserManage', 0, 1, 0, 0);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p188882', 'p188880', '/system/menuManage', 'MenuManage', 188, 'icon-fenlei', 'menu.server.menuManage', 1, 'MenuManage', 0, 1, 1, 0);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p20000', '0', '/article', 'Article', 1, 'icon-biji', 'menu.server.article', 1, 'article', 0, 1, 1, 1);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p20001', 'p20000', '/article/list', 'ArticleList', 1, 'icon-liebiao2', 'menu.server.articleList', 1, 'ArticleList', 0, 1, 1, 1);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p20002', 'p20000', '/article/edit', 'ArticleEdit', 1, 'icon-liebiao2', 'menu.server.articleEdit', 1, 'ArticleEdit', 0, 1, 1, 1);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p30000', '0', '/category', 'Category', 2, 'icon-fenlei1', 'menu.server.category', 1, 'category', 0, 1, 1, 0);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p30001', 'p30000', '/category/list', 'CategoryList', 1, 'icon-liebiao2', 'menu.server.categoryList', 1, 'categoryList', 0, 1, 1, 0);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p40000', '0', '/tag', 'Tag', 2, 'icon-biaoqian', 'menu.server.tag', 1, 'Tag', 0, 1, 1, 0);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p40001', 'p40000', '/tag/list', 'TagList', 1, 'icon-liebiao2', 'menu.server.tagList', 1, 'TagList', 0, 1, 1, 0);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p50000', '0', '/user', 'User', 2, 'icon-gerenzhongxin1', 'menu.server.user', 1, 'User', 0, 1, 1, 1);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p50001', 'p50000', '/user/set', 'UserSet', 1, 'icon-liebiao2', 'menu.server.userSet', 1, 'UserSet', 0, 1, 1, 1);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p60000', '0', '/link', 'Link', 2, 'icon-lianjie', 'menu.server.link', 1, 'Link', 0, 1, 1, 0);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p60001', 'p60000', 'link/list', 'LinkList', 1, 'icon-liebiao2', 'menu.server.linkList', 1, 'LinkList', 0, 1, 1, 0);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p70000', '0', '/msgboard', 'Msgboard', 2, 'icon-liuyanban', 'menu.server.msgboard', 1, 'Msgboard', 0, 1, 1, 0);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p70001', 'p70000', 'list', 'MsgboardList', 1, 'icon-kefu', 'menu.server.msgboardList', 1, 'MsgboardList', 0, 1, 1, 0);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p800000', '0', 'resources', 'Resources', 2, 'icon-wenjianjia1', 'menu.server.resource', 1, 'resources', 0, 1, 1, 0);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p800001', 'p800000', 'resources/list', 'ResourceList', 1, 'icon-fenlei', 'menu.server.resourceList', 1, 'resourceList', 0, 1, 1, 0);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p900000', '0', '/comment', 'Comment', 6, 'icon-liuyanban', 'menu.server.comment', 1, 'comment', 0, 1, 1, 0);
INSERT INTO myblog.menu (id, pid, `path`, name, `order`, icon, locale, requiresAuth, filePath, isDelete, super, admin, author) VALUES('p900001', 'p900000', '/comment/list', 'CommentList', 1, 'icon-fenlei', 'menu.server.commentList', 1, 'commentList', 0, 1, 1, 0);