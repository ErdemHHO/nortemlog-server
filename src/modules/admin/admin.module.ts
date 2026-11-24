import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';
import { Admin } from './entities/admin.entity.js';
import { AdminRepository } from './repository/admin.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [AdminRepository, AdminService],
  exports: [AdminService],
})
export class AdminModule {}
