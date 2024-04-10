import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../article/entity/article.entity';
@Entity()
export class Category {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  uid: number;

  @ApiProperty()
  @Column()
  label: string;

  // @Column({
  //   type: 'text', // 使用 text 类型
  //   transformer: {
  //     to: (value: string[]) => JSON.stringify(value), // 转换为 JSON 字符串
  //     from: (value: string) => JSON.parse(value), // 从 JSON 字符串转换回数组
  //   },
  // })
  // testNums: string[];

  @ApiProperty()
  @Column()
  value: string;

  @ApiProperty()
  @Column()
  color: string;

  @ApiProperty()
  // 一个分类多个文章
  @OneToMany(() => Article, (article) => article.category)
  articles: Array<Article>;

  @ApiProperty()
  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'create_at',
  })
  createAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'update_at',
  })
  updateAt: Date;
}
