import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { catchError, map, Observable, throwError, timestamp } from 'rxjs';


@Injectable()
export class ResponseInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;


        return next.handle().pipe(
            map(data => ({
                status: +statusCode.toString().split('')[0] == 2,
                statusCode,
                message: statusCode >= 400 ? 'Error':'Success',
                error: statusCode >= 400 ? response.message: null,
                data,
            })),

            catchError(err => {
                const statusCode = err instanceof HttpException ? err.getStatus(): 500;
                const errorResponse = {
                    status:  +statusCode.toString().split('')[0] == 2,
                    statusCode,
                    message: err.message || "Internal Server Error",
                    error: err,
                    data: {},
                };
                return throwError(()=> new HttpException(errorResponse, statusCode));
            })
        );
    }
}