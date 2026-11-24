export interface DatabaseError {
  code?: string;
  detail?: string;
}

export interface HttpExceptionResponseObject {
  message?: string | string[];
  error?: string;
}

export interface ErrorResponseBody {
  statusCode: number;
  message: string | string[];
  path: string;
  timestamp: string;
}

export interface ResolvedHttpError {
  statusCode: number;
  message: string | string[];
}
