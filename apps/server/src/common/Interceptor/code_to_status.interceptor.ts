import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ApiResponse {
  code: number;
  message: string;
  data: unknown;
}

@Injectable()
export class CodeToStatusInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    return next.handle().pipe(
      map((value: ApiResponse) => {
        if (typeof response.status === 'function') {
          response.status(value.code);
        }
        return {
          code: value.code,
          message: value.message,
          data: value.data,
        };
      })
    );
  }
}
