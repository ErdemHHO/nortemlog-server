import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ADMIN_ERROR_MESSAGES,
  ADMIN_ROUTES,
  ADMIN_SWAGGER,
} from './constants/admin.constant.js';
import { AdminService } from './admin.service.js';
import { AdminResponseDto } from './dto/admin-response.dto.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';

@ApiTags(ADMIN_SWAGGER.TAG)
@Controller(ADMIN_ROUTES.BASE)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: ADMIN_SWAGGER.CREATE_SUMMARY })
  @ApiCreatedResponse({ type: AdminResponseDto })
  @ApiConflictResponse({
    description: ADMIN_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
  })
  create(@Body() createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @ApiOperation({ summary: ADMIN_SWAGGER.FIND_ALL_SUMMARY })
  @ApiOkResponse({ type: [AdminResponseDto] })
  findAll(): Promise<AdminResponseDto[]> {
    return this.adminService.findAll();
  }
}
