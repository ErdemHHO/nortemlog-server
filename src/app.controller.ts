import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { APP_SWAGGER } from './app.constants.js';
import { AppService } from './app.service.js';

@ApiTags(APP_SWAGGER.TAG)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: APP_SWAGGER.GET_HELLO_SUMMARY })
  @ApiOkResponse({ type: String })
  getHello(): string {
    return this.appService.getHello();
  }
}
