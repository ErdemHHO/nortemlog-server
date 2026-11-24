import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/database/base.repository.js';
import { Admin } from '../entities/admin.entity.js';

@Injectable()
export class AdminRepository extends BaseRepository<Admin> {
  constructor(
    @InjectRepository(Admin)
    repository: Repository<Admin>,
  ) {
    super(repository);
  }

  async findByEmailWithPassword(email: string): Promise<Admin | null> {
    return this.repository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        password: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }
}
