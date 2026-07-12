import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  getApiInfo() {
    return {
      success: true,
      message: 'EN2H Booking Platform API',
      version: '1.0.0',
    };
  }

  async getHealth() {
    try {
      await this.dataSource.query('SELECT 1');

      return {
        success: true,
        status: 'ok',
        api: 'running',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch {
      throw new ServiceUnavailableException(
        'Database connection is unavailable',
      );
    }
  }
}
