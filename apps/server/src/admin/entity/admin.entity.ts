import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity('fyn_admin')
/**
 * 管理员实体
 */
export class Admin {
  /**
   * 管理员ID
   */
  @Field(() => Int, { description: '管理员ID' })
  @PrimaryGeneratedColumn({ name: 'admin_id', comment: '管理员ID' })
  adminId!: number;

  /**
   * 管理员名称
   */
  @Field(() => String, { description: '管理员名称' })
  @Column({
    name: 'admin_name',
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: '管理员名称',
  })
  adminName!: string;

  /**
   * 管理员密码哈希
   */
  @Field(() => String, { description: '管理员密码哈希' })
  @Column({
    name: 'admin_password_hash',
    type: 'text',
    nullable: false,
    comment: '管理员密码哈希',
  })
  adminPasswordHash!: string;

  /**
   * 是否激活
   */
  @Field(() => Boolean, { description: '是否激活', defaultValue: true })
  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    default: () => 'true',
    comment: '是否激活',
  })
  isActive!: boolean;

  /**
   * 创建时间
   */
  @Field(() => Date, { nullable: true, description: '创建时间' })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt!: Date;

  /**
   * 最后更新时间
   */
  @Field(() => Date, { nullable: true, description: '最后更新时间' })
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '最后更新时间',
  })
  updatedAt!: Date;
}
