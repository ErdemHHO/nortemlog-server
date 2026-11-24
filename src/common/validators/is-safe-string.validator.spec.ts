import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { CreateAdminDto } from '../../modules/admin/dto/create-admin.dto.js';

describe('IsSafeString Validator on CreateAdminDto', () => {
  it('passes for safe email and fullName strings', async () => {
    const dto = new CreateAdminDto();
    dto.email = 'admin@northemlog.com';
    dto.fullName = 'Erdem Hacıhasanoğlu';
    dto.password = 'StrongPass123!';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects SQL injection payloads in fullName', async () => {
    const payloads = [
      "Erdem'; DROP TABLE admins; --",
      "admin' OR '1'='1",
      'SELECT * FROM admins',
      'UNION SELECT password FROM users',
      '<script>alert(1)</script>',
    ];

    for (const payload of payloads) {
      const dto = new CreateAdminDto();
      dto.email = 'admin@northemlog.com';
      dto.fullName = payload;
      dto.password = 'StrongPass123!';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    }
  });
});
