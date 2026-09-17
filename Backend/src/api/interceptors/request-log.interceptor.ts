import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const requestId = uuidv4();
    const startTime = Date.now();

    (request as any).requestId = requestId;
    response.setHeader('X-Request-Id', requestId);

    return next.handle().pipe(
      tap({
        next: () => {
          const latency = Date.now() - startTime;
          const userId = (request as any).user?.sub || 'anonymous';
          // NEVER log: Authorization header, request body, query params containing sensitive data
          this.logger.log(
            JSON.stringify({
              requestId,
              method: request.method,
              path: request.url.split('?')[0], // Strip query params from log
              status: response.statusCode,
              latencyMs: latency,
              userId,
            }),
          );
        },
        error: (error) => {
          const latency = Date.now() - startTime;
          const userId = (request as any).user?.sub || 'anonymous';
          this.logger.error(
            JSON.stringify({
              requestId,
              method: request.method,
              path: request.url.split('?')[0],
              status: error.status || 500,
              latencyMs: latency,
              userId,
              errorCode: error.code || 'INTERNAL_ERROR',
            }),
          );
        },
      }),
    );
  }
}
