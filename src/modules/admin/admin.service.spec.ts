import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminService } from './admin.service.js';
import { Admin } from './entities/admin.entity.js';
import { AdminRepository } from './repository/admin.repository.js';

describe('AdminService', () => {
  let service: AdminService;
  let repository: {
    createAndSave: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
  };

  const mockAdmin: Admin = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'admin@northemlog.com',
    fullName: 'Erdem H.',
    isActive: true,
    createdAt: new Date('2026-11-23T18:00:00.000Z'),
    updatedAt: new Date('2026-11-23T18:00:00.000Z'),
    deletedAt: null,
  };

  beforeEach(async () => {
    repository = {
      createAndSave: vi.fn().mockResolvedValue(mockAdmin),
      findAll: vi.fn().mockResolvedValue([mockAdmin]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: AdminRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('creates a new admin and returns response DTO', async () => {
    const result = await service.create({
      email: mockAdmin.email,
      fullName: mockAdmin.fullName,
    });

    expect(repository.createAndSave).toHaveBeenCalledWith({
      email: mockAdmin.email,
      fullName: mockAdmin.fullName,
    });
    expect(result).toEqual(mockAdmin);
  });

  it('returns list of all admins', async () => {
    const result = await service.findAll();

    expect(repository.findAll).toHaveBeenCalledOnce();
    expect(result).toEqual([mockAdmin]);
  });
});
