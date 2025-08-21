import { DynamicModule, Module } from '@nestjs/common';

import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ResourcesModule } from './resources/resources.module';
import { FileModule } from './file/file.module';
import { PubModule } from './pub/pub.module';
import { ReplyModule } from './reply/reply.module';
import { MsgboardModule } from './msgboard/msgboard.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';

@Module({})
export class FeaturesModule {
  static register(modules: any[] = []): DynamicModule {
    const all = [
      ArticleModule,
      CategoryModule,
      TagModule,
      CommentModule,
      LikeModule,
      ResourcesModule,
      FileModule,
      PubModule,
      ReplyModule,
      MsgboardModule,
      UserModule,
      AdminModule,
    ];
    const enabled = modules.length ? modules : all;
    return {
      module: FeaturesModule,
      imports: enabled,
      exports: enabled,
    };
  }
}
