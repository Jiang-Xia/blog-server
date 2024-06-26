import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

/* 文件表 */
@Entity({ name: 'file' })
export class FileStore {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ default: '0' })
  pid: string; // 文件名

  @ApiProperty()
  @Column({ default: false })
  isFolder: boolean; // 文件名

  @ApiProperty()
  @Column()
  originalname: string; // 文件名

  @ApiProperty()
  @Column()
  filename: string; // 文件名

  @ApiProperty()
  @Column()
  type: string; // 文件信息

  @ApiProperty()
  @Column()
  size: number; // 文件大小

  @ApiProperty()
  @Column()
  url: string;

  @ApiProperty()
  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'create_at',
  })
  createAt: Date;
}
