/* eslint-disable @typescript-eslint/no-require-imports */
import { DataSource } from 'typeorm';
import { entities } from './entities';
import { migrations } from './migrations';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DBNAME,
  supportBigNumbers: false,
  synchronize: false, // Do not use synchronize
  logging: process.env.NODE_ENV === 'production' ? false : true,
  charset: 'utf8mb4',
  entities: [
    ...entities,
    // 'dist/src/database/entities/**/*{.ts,.js}',
    // 'dist/src/app/shared/**/entities/**/*{.ts,.js}',
    // 'dist/libs/**/entities/**/*{.ts,.js}',
  ],
  migrations: [
    ...migrations,
    // 'dist/src/database/migrations/**/*{.ts,.js}',
    // 'dist/src/app/shared/**/migrations/**/*{.ts,.js}',
    // 'dist/libs/**/migrations/**/*{.ts,.js}',
  ],
  subscribers: [
    // 'dist/src/database/subscribers/*{.ts,.js}',
    // 'dist/src/app/shared/**/subscribers/**/*{.ts,.js}',
    // 'dist/libs/**/subscribers/**/*{.ts,.js}',
  ],
  timezone: 'Z',
  extra: {
    decimalNumbers: true,
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || 10,
  },
});
//npm run migration:generate --name=
