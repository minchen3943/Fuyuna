import { ApiTags, ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ApiTags('管理员表')
@ObjectType()
@Entity('fyn_admin')
export class Admin {
  @ApiProperty({
    description: '管理员ID',
    type: Number,
  })
  @Field(() => Int, { description: '管理员ID' })
  @PrimaryGeneratedColumn({ name: 'admin_id' })
  adminId!: number;

  @ApiProperty({
    description: '管理员名称',
    type: String,
    maxLength: 20,
  })
  @Field(() => String, { description: '管理员名称' })
  @Column({
    name: 'admin_name',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  adminName!: string;

  @ApiProperty({
    description: '管理员密码哈希',
    type: String,
    format: 'password',
    writeOnly: true,
  })
  @Field(() => String, { description: '管理员密码哈希' })
  @Column({
    name: 'admin_password_hash',
    type: 'text',
    nullable: false,
  })
  adminPasswordHash!: string;

  @ApiProperty({
    description: '是否激活',
    type: Boolean,
    default: true,
  })
  @Field(() => Boolean, { description: '是否激活', defaultValue: true })
  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    default: () => 'true',
  })
  isActive!: boolean;

  @ApiProperty({
    description: '创建时间',
    type: String,
    format: 'date-time',
  })
  @Field(() => Date, { description: '创建时间' })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @ApiProperty({
    description: '更新时间',
    type: String,
    format: 'date-time',
  })
  @Field(() => Date, { description: '更新时间' })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
