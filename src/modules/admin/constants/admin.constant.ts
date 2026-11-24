export const ADMIN_TABLE_NAME = 'admins' as const;

export const ADMIN_ROUTES = {
  BASE: 'admin',
} as const;

export const ADMIN_COLUMNS = {
  FULL_NAME: 'full_name',
  PASSWORD: 'password',
  IS_ACTIVE: 'is_active',
} as const;

export const ADMIN_CONSTRAINTS = {
  EMAIL_MAX_LENGTH: 255,
  FULL_NAME_MIN_LENGTH: 2,
  FULL_NAME_MAX_LENGTH: 150,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  PASSWORD_HASH_MAX_LENGTH: 255,
} as const;

export const ADMIN_ERROR_MESSAGES = {
  EMAIL_ALREADY_EXISTS: 'Bu e-posta adresi ile kayıtlı bir yönetici zaten mevcut.',
  NOT_FOUND: 'Yönetici bulunamadı.',
} as const;

export const ADMIN_SWAGGER = {
  TAG: 'Admin',
  CREATE_SUMMARY: 'Yeni yönetici oluşturur',
  FIND_ALL_SUMMARY: 'Tüm yöneticileri listeler',
  EMAIL_DESCRIPTION: 'Yöneticinin benzersiz e-posta adresi',
  EMAIL_EXAMPLE: 'admin@northemlog.com',
  FULL_NAME_DESCRIPTION: 'Yöneticinin adı ve soyadı',
  FULL_NAME_EXAMPLE: 'Erdem H.',
  PASSWORD_DESCRIPTION: 'Yöneticinin giriş şifresi',
  PASSWORD_EXAMPLE: 'StrongPass123!',
  ID_DESCRIPTION: 'Yöneticinin benzersiz kimliği (UUID)',
  IS_ACTIVE_DESCRIPTION: 'Yönetici hesabının aktiflik durumu',
  CREATED_AT_DESCRIPTION: 'Oluşturulma tarihi (UTC)',
  UPDATED_AT_DESCRIPTION: 'Son güncellenme tarihi (UTC)',
  DELETED_AT_DESCRIPTION: 'Silinme tarihi (UTC, aktifse null)',
} as const;
