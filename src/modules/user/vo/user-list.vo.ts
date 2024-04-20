import type { PaginationType } from '@/types';
import { User } from '../entity/user.entity';
export class userListVO {
  list: User[];
  pagination: PaginationType;
}
