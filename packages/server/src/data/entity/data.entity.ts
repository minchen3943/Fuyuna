import { Field, ObjectType, Int, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 网站核心统计指标（单行存储）
 */
@ObjectType()
@Entity('fyn_data')
export class Data {
  /**
   * 网站数据ID
   */
  @Field(() => ID)
  @PrimaryGeneratedColumn({ name: 'data_id' })
  id!: number;

  /**
   * 网站总访问量
   */
  @Field(() => Int)
  @Column({
    type: 'integer',
    name: 'visit_count',
    default: 0,
    comment: '网站总访问量',
  })
  visitCount!: number;

  /**
   * 累计点赞数
   */
  @Field(() => Int)
  @Column({
    type: 'integer',
    name: 'like_count',
    default: 0,
    comment: '累计点赞数',
  })
  likeCount!: number;

  /**
   * 创建时间
   */
  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt!: Date;

  /**
   * 最后统计时间
   */
  @Field(() => Date)
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '最后统计时间',
  })
  updatedAt!: Date;
}
