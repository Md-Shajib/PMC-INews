import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getDatabaseHost() {
    const host = this.configService.get('DATABASE_HOST');
    return `The database host is ${host}`;
  }
  getHello(): string {
    return 'Hello World!';
  }
}
