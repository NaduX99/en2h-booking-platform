import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get()
  getApiInfo() {
    return this.appService.getApiInfo();
  }

  @Get('health')
  @SkipThrottle()
  getHealth() {
    return this.appService.getHealth();
  }
}