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
}
