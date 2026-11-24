import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';
import { AdminResponseDto } from './dto/admin-response.dto.js';

describe('AdminController', () => {
  let controller: AdminController;
  let service: {
    create: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
  };

  const mockAdminResponse: AdminResponseDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'admin@northemlog.com',
    fullName: 'Erdem H.',
    isActive: true,
    createdAt: new Date('2026-11-23T18:00:00.000Z'),
    updatedAt: new Date('2026-11-23T18:00:00.000Z'),
    deletedAt: null,
  };

  beforeEach(async () => {
    service = {
      create: vi.fn().mockResolvedValue(mockAdminResponse),
      findAll: vi.fn().mockResolvedValue([mockAdminResponse]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: service,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: vi.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('delegates admin creation to AdminService', async () => {
    const dto = {
      email: mockAdminResponse.email,
      fullName: mockAdminResponse.fullName,
      password: 'StrongPass123!',
    };

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockAdminResponse);
  });

  it('delegates listing admins to AdminService', async () => {
    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalledOnce();
    expect(result).toEqual([mockAdminResponse]);
  });
});
