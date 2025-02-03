import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan'

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(request: Request, response: Response, next: NextFunction): void {
        morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
            stream: {
                write: (message) => this.logger.log(message.trim()) // trim to remove extra newline
            }
        })(request, response, next); // Let Morgan handle `next()`
    }
}