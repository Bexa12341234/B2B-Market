import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(configService: ConfigService) {
    const connectionString =
      configService.get<string>('DATABASE_URL') || 'file:./dev.db';
    const dbFile = connectionString.replace('file:', '');
    const adapter = new PrismaBetterSqlite3({ url: dbFile });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
