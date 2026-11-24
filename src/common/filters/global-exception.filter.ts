import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { POSTGRES_ERROR_CODES } from '../constants/database.constants.js';
import { ERROR_MESSAGES } from '../constants/error.constants.js';
import {
  DatabaseError,
  ErrorResponseBody,
  HttpExceptionResponseObject,
  ResolvedHttpError,
} from '../interfaces/error.interface.js';

function isDatabaseError(exception: unknown): exception is DatabaseError {
  return (
    typeof exception === 'object' &&
    exception !== null &&
    'code' in exception &&
    typeof (exception as DatabaseError).code === 'string'
  );
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message } = this.resolveError(exception, request.url);

    const body: ErrorResponseBody = {
      statusCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(body);
  }

  private resolveError(exception: unknown, path: string): ResolvedHttpError {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();

      if (statusCode >= Number(HttpStatus.INTERNAL_SERVER_ERROR)) {
        this.logger.error(
          `HTTP ${String(statusCode)} on ${path}: ${exception.message}`,
          exception.stack,
        );
        return {
          statusCode,
          message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        };
      }

      return {
        statusCode,
        message: this.extractHttpMessage(exception),
      };
    }

    if (isDatabaseError(exception)) {
      if (exception.code === POSTGRES_ERROR_CODES.UNIQUE_VIOLATION) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: ERROR_MESSAGES.UNIQUE_CONSTRAINT_VIOLATION,
        };
      }

      if (exception.code === POSTGRES_ERROR_CODES.FOREIGN_KEY_VIOLATION) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ERROR_MESSAGES.FOREIGN_KEY_VIOLATION,
        };
      }
    }

    this.logger.error(
      `Unhandled exception on ${path}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    };
  }

  private extractHttpMessage(exception: HttpException): string | string[] {
    const response = exception.getResponse();

    if (typeof response === 'string') {
      return response;
    }

    if (typeof response === 'object' && response !== null) {
      const responseObj = response as HttpExceptionResponseObject;
      if (responseObj.message !== undefined) {
        return responseObj.message;
      }
    }

    return exception.message;
  }
}
