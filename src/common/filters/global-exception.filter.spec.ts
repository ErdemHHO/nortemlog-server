import {
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { POSTGRES_ERROR_CODES } from '../constants/database.constants.js';
import { ERROR_MESSAGES } from '../constants/error.constants.js';
import { GlobalExceptionFilter } from './global-exception.filter.js';

describe('GlobalExceptionFilter', () => {
  const createMockHost = (url = '/admin') => {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
        getRequest: () => ({ url }),
      }),
    } as unknown as ArgumentsHost;

    return { host, status, json };
  };

  it('passes through standard 4xx HttpExceptions with their message', () => {
    const filter = new GlobalExceptionFilter();
    const { host, status, json } = createMockHost();

    filter.catch(new BadRequestException('Geçersiz istek.'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Geçersiz istek.',
        path: '/admin',
      }),
    );
  });

  it('always returns Turkish generic message for 500 HttpExceptions', () => {
    const filter = new GlobalExceptionFilter();
    const { host, status, json } = createMockHost();

    filter.catch(new InternalServerErrorException('Secret DB stack'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      }),
    );
  });

  it('always returns Turkish generic message for unhandled unknown errors', () => {
    const filter = new GlobalExceptionFilter();
    const { host, status, json } = createMockHost();

    filter.catch(new Error('Unexpected database crash'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      }),
    );
  });

  it('maps PostgreSQL 23505 unique constraint error to 409 Conflict in Turkish', () => {
    const filter = new GlobalExceptionFilter();
    const { host, status, json } = createMockHost();

    filter.catch({ code: POSTGRES_ERROR_CODES.UNIQUE_VIOLATION }, host);

    expect(status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.CONFLICT,
        message: ERROR_MESSAGES.UNIQUE_CONSTRAINT_VIOLATION,
      }),
    );
  });
});
