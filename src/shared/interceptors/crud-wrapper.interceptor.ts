import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { R } from '@nestjsx/crud/lib/crud';

@Injectable()
export class CrudWrapperInterceptor implements NestInterceptor {
  private isObject(data) {
    return typeof data === 'object' && data !== null;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          return;
        }
        try {
          if (data?.data && Array.isArray(data.data)) {
            data.data = data.data.map((d) => d.toJSON());
          }
          if (!data.data && this.isObject(data)) {
            data = { data: data.toJSON() };
          }
        } catch (e) {}
        const override = R.getOverrideRoute(context.getHandler());
        // if the function is overridden then don't wrap the response
        if (override || !data) {
          // the handler didn't return anything
          return data;
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
