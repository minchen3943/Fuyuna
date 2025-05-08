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
  @PrimaryGeneratedColumn({ name: 'admin_id' })
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
  })
  isActive!: boolean;

  /**
   * 创建时间
   */
  @Field(() => Date, { description: '创建时间' })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  /**
   * 更新时间
   */
  @Field(() => Date, { description: '更新时间' })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
