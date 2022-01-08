import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          return;
        }
        const keys = Object.keys(data);
        // this is a paginated request
        if (
          (keys.includes('data') && keys.includes('count')) ||
          // this request is already wrapped
          (keys.length === 1 && keys[0] === 'data')
        ) {
          return data;
        }
        return { data };
      }),
    );
  }
}
