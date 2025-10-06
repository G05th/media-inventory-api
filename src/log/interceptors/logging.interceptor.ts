import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LogService } from '../log.service';

interface MediaAssetsResponse {
  _id: string;
  title: string;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();

    const actorId = '60c72b9f9b1d8e0015f8e5b4';
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data: MediaAssetsResponse) => {
          console.log(
            `[LOG SUCCESS] ${request.method} ${request.url} levou ${Date.now() - now}`,
          );
          if (request.method == 'POST' && data && data._id) {
            void this.logService.saveLog({
              action: 'MEDIA_ASSET_CREATED',
              mediaAssetId: data._id.toString(),
              actorId: actorId,
              details: { title: data.title },
            });
          }
        },
        error: (err) => {
          console.error(
            `LOG - ERRO ${request.method} ${request.url} falhou: ${err}`,
          );
        },
      }),
    );
  }
}
