export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Bir hata oluştu.',
  UNIQUE_CONSTRAINT_VIOLATION: 'Bu kayıt zaten mevcut.',
  FOREIGN_KEY_VIOLATION: 'İlişkili kayıt bulunamadı veya silinemez.',
  INVALID_INPUT: 'Geçersiz veri gönderildi.',
  UNSAFE_STRING:
    '$property alanı güvenlik açısından izin verilmeyen karakterler veya ifadeler içeriyor.',
} as const;

export const VALIDATION_MESSAGES = {
  IS_STRING: '$property alanı metin (string) olmalıdır.',
  IS_NOT_EMPTY: '$property alanı boş bırakılamaz.',
  IS_EMAIL: 'Geçerli bir e-posta adresi giriniz.',
  MIN_LENGTH: '$property alanı en az $constraint1 karakter olmalıdır.',
  MAX_LENGTH: '$property alanı en fazla $constraint1 karakter olmalıdır.',
} as const;

export const SAFE_STRING_VALIDATOR_NAME = 'isSafeString' as const;
