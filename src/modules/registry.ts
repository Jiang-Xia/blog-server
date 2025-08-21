// src/modules/registry.ts
import { RedisModule } from './core/redis/redis.module';
import { CaptchaModule } from './security/captcha/captcha.module';

import { AuthModule } from './security/auth/auth.module';
import { FeaturesModule } from './features';

export const CoreModules = [RedisModule];
export const SecurityModules = [AuthModule, CaptchaModule];
export const FeatureModules = [FeaturesModule.registerFromEnv()];

export const AllAppModules = [...CoreModules, ...SecurityModules, ...FeatureModules];