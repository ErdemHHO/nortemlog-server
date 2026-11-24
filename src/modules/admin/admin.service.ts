import { Injectable } from '@nestjs/common';
import { hashPassword } from '../../common/utils/password.util.js';
import { AdminResponseDto } from './dto/admin-response.dto.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { Admin } from './entities/admin.entity.js';
import { AdminRepository } from './repository/admin.repository.js';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async create(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    const hashedPassword = await hashPassword(createAdminDto.password);
    const admin = await this.adminRepository.createAndSave({
      email: createAdminDto.email,
      fullName: createAdminDto.fullName,
      password: hashedPassword,
    });
    return this.toResponseDto(admin);
  }

  async findAll(): Promise<AdminResponseDto[]> {
    const admins = await this.adminRepository.findAll();
    return admins.map((admin) => this.toResponseDto(admin));
  }

  async findById(id: string): Promise<Admin | null> {
    return this.adminRepository.findOneById(id);
  }

  async findByEmailWithPassword(email: string): Promise<Admin | null> {
    return this.adminRepository.findByEmailWithPassword(email);
  }

  private toResponseDto(admin: Admin): AdminResponseDto {
    return {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      deletedAt: admin.deletedAt,
    };
  }
}
