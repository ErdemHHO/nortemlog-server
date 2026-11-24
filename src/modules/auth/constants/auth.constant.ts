export const AUTH_ROUTES = {
  BASE: 'auth',
  LOGIN: 'login',
  REFRESH: 'refresh',
} as const;

export const AUTH_TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  BEARER: 'Bearer',
} as const;

export const AUTH_HEADERS = {
  AUTHORIZATION: 'authorization',
  BEARER_PREFIX: 'Bearer ',
} as const;

export const AUTH_REQUEST_KEYS = {
  ADMIN: 'admin',
} as const;

export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'E-posta adresi veya şifre hatalı.',
  ACCOUNT_INACTIVE: 'Yönetici hesabı aktif değil.',
  MISSING_TOKEN: 'Yetkilendirme tokenı bulunamadı.',
  INVALID_OR_EXPIRED_TOKEN: 'Geçersiz veya süresi dolmuş token.',
  INVALID_TOKEN_TYPE: 'Geçersiz token tipi.',
} as const;

export const AUTH_SWAGGER = {
  TAG: 'Auth',
  LOGIN_SUMMARY: 'Yönetici girişi yapar ve JWT token çifti üretir',
  REFRESH_SUMMARY: 'Refresh token kullanarak yeni JWT token çifti üretir',
  EMAIL_DESCRIPTION: 'Yöneticinin kayıtlı e-posta adresi',
  EMAIL_EXAMPLE: 'admin@northemlog.com',
  PASSWORD_DESCRIPTION: 'Yöneticinin giriş şifresi',
  PASSWORD_EXAMPLE: 'StrongPass123!',
  REFRESH_TOKEN_DESCRIPTION: 'Yenileme (Refresh) JWT tokenı',
  REFRESH_TOKEN_EXAMPLE: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  ACCESS_TOKEN_DESCRIPTION: 'Erişim (Access) JWT tokenı',
  ACCESS_TOKEN_EXAMPLE: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  TOKEN_TYPE_DESCRIPTION: 'Yetkilendirme şeması tipi',
  TOKEN_TYPE_EXAMPLE: 'Bearer',
  EXPIRES_IN_DESCRIPTION: 'Access token geçerlilik süresi (saniye)',
  EXPIRES_IN_EXAMPLE: 900,
  UNAUTHORIZED_DESCRIPTION: 'Kimlik doğrulama başarısız veya yetkisiz erişim',
  FORBIDDEN_DESCRIPTION: 'Yönetici hesabı pasif veya erişim engellendi',
} as const;
