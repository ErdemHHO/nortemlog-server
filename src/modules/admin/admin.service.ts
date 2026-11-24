import { Injectable } from '@nestjs/common';
import { AdminResponseDto } from './dto/admin-response.dto.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { Admin } from './entities/admin.entity.js';
import { AdminRepository } from './repository/admin.repository.js';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async create(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    const admin = await this.adminRepository.createAndSave(createAdminDto);
    return this.toResponseDto(admin);
  }

  async findAll(): Promise<AdminResponseDto[]> {
    const admins = await this.adminRepository.findAll();
    return admins.map((admin) => this.toResponseDto(admin));
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
