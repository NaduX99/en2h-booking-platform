import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo() {
    return {
      success: true,
      message: 'EN2H Booking Platform API',
      version: '1.0.0',
    };
  }

  getHealth() {
    return {
      success: true,
      status: 'ok',
      message: 'API is running',
      timestamp: new Date().toISOString(),
    };
  }
}