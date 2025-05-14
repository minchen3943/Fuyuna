import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entity/admin.entity';
import { Repository } from 'typeorm';
import { CreateAdminInput, UpdateAdminInput } from './input/admin.input';
import * as bcrypt from 'bcryptjs';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/constants';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly saltRounds = 13;

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis
  ) {}

  /**
   * 查询所有管理员信息
   * @returns 管理员数组或 null
   */
  public async findAll(): Promise<Admin[] | null> {
    const key = `user:all`;
    const cached = await this.redis.get(key);
    if (cached) {
      const admins = JSON.parse(cached) as Admin[];
      admins.forEach((admin) => {
        admin.createdAt = new Date(admin.createdAt);
        admin.updatedAt = new Date(admin.updatedAt);
      });
      this.logger.log(`(cache) Found ${admins.length} admins`);
      this.logger.debug(`(cache) Admins: ${JSON.stringify(admins)}`);
      return admins;
    }
    const admins = await this.adminRepo.find();
    if (admins.length > 0) {
      this.logger.log(`Found ${admins.length} admins`);
      this.logger.debug(`Admins: ${JSON.stringify(admins)}`);
      await this.redis.set(key, JSON.stringify(admins), 'EX', 18000);
      return admins;
    }
    this.logger.warn('No admins found');
    return null;
  }

  /**
   * 根据管理员ID查询管理员信息
   * @param id 管理员ID
   * @returns 管理员实体或 null
   */
  public async findById(id: number): Promise<Admin | null> {
    const key = `user:id:${id}`;
    const cached = await this.redis.get(key);
    if (cached) {
      const admin = JSON.parse(cached) as Admin;
      admin.createdAt = new Date(admin.createdAt);
      admin.updatedAt = new Date(admin.updatedAt);
      this.logger.log(`(cache) Found admin with ID ${id}`);
      this.logger.debug(`(cache) Admin: ${JSON.stringify(admin)}`);
      return admin;
    }
    const admin = await this.adminRepo.findOneBy({ adminId: id });
    if (admin) {
      this.logger.log(`Found admin with ID ${id}`);
      this.logger.debug(`Admin: ${JSON.stringify(admin)}`);
      await this.redis.set(key, JSON.stringify(admin), 'EX', 18000);
      return admin;
    }
    this.logger.warn(`No admin found with ID ${id}`);
    return null;
  }

  /**
   * 根据管理员名称查询管理员信息
   * @param name 管理员名称
   * @returns 管理员实体或 null
   */
  public async findByName(name: string): Promise<Admin | null> {
    const key = `user:name:${name}`;
    const cached = await this.redis.get(key);
    if (cached) {
      const admin = JSON.parse(cached) as Admin;
      admin.createdAt = new Date(admin.createdAt);
      admin.updatedAt = new Date(admin.updatedAt);
      this.logger.log(`(cache) Found admin with NAME ${name}`);
      this.logger.debug(`(cache) Admin: ${JSON.stringify(admin)}`);
      return admin;
    }
    const admin = await this.adminRepo.findOneBy({ adminName: name });
    if (admin) {
      this.logger.log(`Found admin with NAME ${name}`);
      this.logger.debug(`Admin: ${JSON.stringify(admin)}`);
      await this.redis.set(key, JSON.stringify(admin), 'EX', 18000);
      return admin;
    }
    this.logger.warn(`No admin found with NAME ${name}`);
    return null;
  }

  /**
   * 创建管理员
   * @param input 创建管理员输入参数
   * @returns 创建后的管理员实体或 null
   */
  public async create(input: CreateAdminInput): Promise<Admin | null> {
    const admin = this.adminRepo.create({
      adminName: input.adminName,
      adminPasswordHash: await this.handlePassword(input.adminPassword),
    });
    const result = await this.adminRepo.save(admin);
    if (result) {
      await this.redis.del(`user:all`);
      await this.redis.del(`user:name:${input.adminName}`);
      await this.redis.del(`user:id:${result.adminId}`);
      this.logger.log(`Admin created successfully with ID ${result.adminId}`);
      this.logger.debug(`Admin: ${JSON.stringify(result)}`);
      return result;
    } else {
      this.logger.warn('Failed to create admin');
      return null;
    }
  }

  /**
   * 更新管理员信息
   * @param input 更新管理员输入参数
   * @returns 更新后的管理员实体或 null
   */
  public async update(input: UpdateAdminInput): Promise<Admin | null> {
    const admin = await this.adminRepo.findOneBy({ adminId: input.adminId });
    if (!admin) {
      this.logger.warn(`No admin found with ID ${input.adminId}`);
      return null;
    }
    if (input.adminPassword) {
      admin.adminPasswordHash = await this.handlePassword(input.adminPassword);
    }
    if (input.adminName) {
      admin.adminName = input.adminName;
    }
    if (typeof input.isActive === 'boolean') {
      admin.isActive = input.isActive;
    }
    const result = await this.adminRepo.save(admin);
    if (result) {
      await this.redis.del(`user:all`);
      await this.redis.del(`user:name:${admin.adminName}`);
      await this.redis.del(`user:id:${admin.adminId}`);
      const final = await this.findById(admin.adminId);
      this.logger.log(`Admin updated successfully with ID ${admin.adminId}`);
      this.logger.debug(`Admin: ${JSON.stringify(final)}`);
      return final;
    } else {
      this.logger.warn(`Failed to update Admin with ID ${admin.adminId}`);
      return null;
    }
  }

  /**
   * 更新管理员激活状态
   * @param id 管理员ID
   * @param isActive 是否激活
   * @returns 更新后的管理员实体或 null
   */
  public async updateActive(
    id: number,
    isActive: boolean
  ): Promise<Admin | null> {
    if (!(await this.findById(id))) {
      return null;
    }
    await this.adminRepo.update(id, { isActive });
    await this.redis.del(`user:all`);
    await this.redis.del(`user:id:${id}`);
    this.logger.log(
      `Updated admin active status id=${id} isActive=${isActive}`
    );
    this.logger.debug(
      `Updated admin active status: ${JSON.stringify(isActive)}`
    );
    return this.findById(id);
  }

  /**
   * 删除管理员
   * @param id 管理员ID
   * @returns 是否删除成功
   */
  public async remove(id: number): Promise<boolean> {
    const result = await this.adminRepo.delete(id);
    if (result.affected === 1) {
      await this.redis.del(`user:all`);
      await this.redis.del(`user:id:${id}`);
      await this.redis.del(`user:name:${id}`);
      this.logger.log(`Admin deleted successfully with ID ${id}`);
      this.logger.debug(`Result: ${JSON.stringify(result)}`);
      return Promise.resolve(true);
    } else {
      this.logger.warn(`Failed to delete Admin with ID ${id}`);
      return Promise.resolve(false);
    }
  }

  /**
   * 校验管理员密码
   * @param data 登录输入参数
   * @returns 密码是否正确
   */
  public async checkAdminPassWord(
    admin: Admin,
    adminPassword: string
  ): Promise<boolean> {
    return Promise.resolve(
      await bcrypt.compare(adminPassword, admin.adminPasswordHash)
    );
  }

  private async handlePassword(rawPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    return hashedPassword;
  }
}
