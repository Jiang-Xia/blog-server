import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

/* 点赞表 */
@Entity()
export class MyFile {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
