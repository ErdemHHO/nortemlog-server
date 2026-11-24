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
    findOneById: ReturnType<typeof vi.fn>;
    findByEmailWithPassword: ReturnType<typeof vi.fn>;
  };

  const mockAdmin: Admin = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'admin@northemlog.com',
    fullName: 'Erdem H.',
    password: 'hashed_password',
    isActive: true,
    createdAt: new Date('2026-11-23T18:00:00.000Z'),
    updatedAt: new Date('2026-11-23T18:00:00.000Z'),
    deletedAt: null,
  };

  const expectedResponse = {
    id: mockAdmin.id,
    email: mockAdmin.email,
    fullName: mockAdmin.fullName,
    isActive: mockAdmin.isActive,
    createdAt: mockAdmin.createdAt,
    updatedAt: mockAdmin.updatedAt,
    deletedAt: mockAdmin.deletedAt,
  };

  beforeEach(async () => {
    repository = {
      createAndSave: vi.fn().mockResolvedValue(mockAdmin),
      findAll: vi.fn().mockResolvedValue([mockAdmin]),
      findOneById: vi.fn().mockResolvedValue(mockAdmin),
      findByEmailWithPassword: vi.fn().mockResolvedValue(mockAdmin),
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

  it('hashes password, creates a new admin and returns response DTO without password', async () => {
    const result = await service.create({
      email: mockAdmin.email,
      fullName: mockAdmin.fullName,
      password: 'StrongPass123!',
    });

    expect(repository.createAndSave).toHaveBeenCalledOnce();
    const savedArg = repository.createAndSave.mock.calls[0]?.[0] as {
      email: string;
      fullName: string;
      password: string;
    };
    expect(savedArg.email).toBe(mockAdmin.email);
    expect(savedArg.fullName).toBe(mockAdmin.fullName);
    expect(savedArg.password).not.toBe('StrongPass123!');
    expect(savedArg.password).toContain(':');
    expect(result).toEqual(expectedResponse);
  });

  it('returns list of all admins', async () => {
    const result = await service.findAll();

    expect(repository.findAll).toHaveBeenCalledOnce();
    expect(result).toEqual([expectedResponse]);
  });

  it('finds admin by id', async () => {
    const result = await service.findById(mockAdmin.id);

    expect(repository.findOneById).toHaveBeenCalledWith(mockAdmin.id);
    expect(result).toEqual(mockAdmin);
  });

  it('finds admin by email with password', async () => {
    const result = await service.findByEmailWithPassword(mockAdmin.email);

    expect(repository.findByEmailWithPassword).toHaveBeenCalledWith(
      mockAdmin.email,
    );
    expect(result).toEqual(mockAdmin);
  });
});
