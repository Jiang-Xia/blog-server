// src/modules/registry.ts
import { RedisGrpcModule } from './features/grpc/redis-grpc.module';
import { CaptchaModule } from './security/captcha/captcha.module';

import { AuthModule } from './security/auth/auth.module';
import { FeaturesModule } from './features';
import { PayModule } from './pay/pay.module';

export const CoreModules = [RedisGrpcModule];
export const SecurityModules = [AuthModule, CaptchaModule];
export const FeatureModules = [FeaturesModule.register()];

export const AllAppModules = [...CoreModules, ...SecurityModules, ...FeatureModules, PayModule];
