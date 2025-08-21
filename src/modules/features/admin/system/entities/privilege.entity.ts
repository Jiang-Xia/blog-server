import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseModel } from '@/modules/features/common/common.entiry';
import { Role } from './role.entity';

@Entity({
  name: 'privilege',
  comment: '权限表',
})
export class Privilege extends BaseModel {
  @ApiProperty({ description: '权限英文名' })
  @Column({ comment: '权限英文名' })
  value: string;

  @ApiProperty({ description: '权限名' })
  @Column({ comment: '权限名' })
  label: string;

  @ApiProperty()
  @ManyToMany(() => Role, (role) => role.privileges, { cascade: false })
  roles: Array<Role>;

  @ApiProperty({ description: '菜单id' })
  @Column({ comment: '菜单id' })
  menuId: string;
}
