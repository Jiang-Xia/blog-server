import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { BaseModel } from '@/modules/common/common.entiry';
import { Privilege } from './privilege.entity';
import { User } from '@/modules/user/entity/user.entity';

// 角色表
@Entity({
  name: 'role',
  comment: '角色表',
})
export class Role extends BaseModel {
  @ApiProperty({ description: '角色英文名' })
  @Column({ comment: '角色英文名' })
  value: string;

  @ApiProperty({ description: '角色名' })
  @Column({ comment: '角色名' })
  label: string;

  @ApiProperty()
  @ManyToMany(() => Privilege, (privilege) => privilege.roles, { cascade: false })
  @JoinTable()
  privileges: Array<Privilege>;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.roles, { cascade: false })
  @JoinTable()
  users: Array<Privilege>;
}
