import { Injectable } from '@nestjs/common';
import { APP_MESSAGES } from './app.constants.js';

@Injectable()
export class AppService {
  getHello(): string {
    return APP_MESSAGES.HELLO_WORLD;
  }
}
