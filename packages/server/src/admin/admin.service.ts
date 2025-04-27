import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entity/admin.entity';
import { Repository } from 'typeorm';
import {
  CreateAdminInput,
  LoginAdminInput,
  UpdateAdminInput,
} from './input/admin.input';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly saltRounds = 13;

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}

  public async findAll(): Promise<Admin[] | null> {
    const admins = await this.adminRepo.find();
    if (admins.length > 0) {
      this.logger.log(`Found ${admins.length} admins`);
      return admins;
    }
    this.logger.warn('No admins found');
    return null;
  }

  public async findById(id: number): Promise<Admin | null> {
    const admin = await this.adminRepo.findOneBy({ adminId: id });
    if (admin) {
      this.logger.log(`Found admin with ID ${id}`);
      return admin;
    }
    this.logger.warn(`No admin found with ID ${id}`);
    return null;
  }

  public async findByName(name: string): Promise<Admin | null> {
    return await this.adminRepo.findOneBy({ adminName: name });
  }

  public async create(input: CreateAdminInput): Promise<Admin | null> {
    const admin = this.adminRepo.create({
      adminName: input.adminName,
      adminPasswordHash: await this.handlePassword(input.adminPassword),
    });
    const result = await this.adminRepo.save(admin);
    if (result) {
      this.logger.log(`Admin created successfully with ID ${result.adminId}`);
      return result;
    } else {
      this.logger.warn('Failed to create admin');
      return null;
    }
  }

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
      this.logger.log(`Admin updated successfully with ID ${admin.adminId}`);
      return this.findById(admin.adminId);
    } else {
      this.logger.warn(`Failed to update Admin with ID ${admin.adminId}`);
      return null;
    }
  }

  public async updateActive(
    id: number,
    isActive: boolean,
  ): Promise<Admin | null> {
    await this.adminRepo.update(id, { isActive });
    return this.findById(id);
  }

  public async remove(id: number): Promise<boolean> {
    const result = await this.adminRepo.delete(id);
    if (result.affected === 1) {
      this.logger.log(`Admin deleted successfully with ID ${id}`);
      return Promise.resolve(true);
    } else {
      this.logger.warn(`Failed to delete Admin with ID ${id}`);
      return Promise.resolve(false);
    }
  }

  public async checkAdminPassWord(data: LoginAdminInput): Promise<boolean> {
    const correctUser = await this.adminRepo.findOneBy({
      adminName: data.adminName,
    });
    if (!correctUser) {
      throw new Error(`No admin found with NAME ${data.adminName}`);
    }
    return Promise.resolve(
      await bcrypt.compare(data.adminPassword, correctUser.adminPasswordHash),
    );
  }

  private async handlePassword(rawPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    return hashedPassword;
  }
}
