import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';
/* admin 角色类型表 */
// 暂时用不到
@Entity()
export class Role {
  @ApiProperty({ description: '自身id' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ description: '角色类型' })
  @Column({
    type: 'enum',
    enum: ['super', 'admin', 'author'],
    default: 'author',
  })
  role: string;
}
