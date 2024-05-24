import { DataSource } from 'typeorm';
import * as config from 'config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTsNode = !!(process as any)[Symbol.for('ts-node.register.instance')];

const USER = config.get<string>('db.pgTypeOrm.user');
const PASSWORD = config.get<string>('db.pgTypeOrm.password');
const HOST = config.get<string>('db.pgTypeOrm.host');
const PORT = config.get<number>('db.pgTypeOrm.port');
const DB = config.get<string>('db.pgTypeOrm.db');

const dbDataSource = new DataSource(
  {
    type: 'postgres',
    host: HOST,
    port: PORT,
    username: USER,
    password: PASSWORD,
    database: DB,
    entities: [
      isTsNode
        ? '../../../models/pgt/**/*.ts'
        : '../../../models/pgt/**/*.js',
    ],
    migrations: [
      isTsNode
        ? './migrations/**/*.ts'
        : './migrations/**/*.js',
    ],
    migrationsTableName: 'typeorm_migrations',
    migrationsRun: false,
    synchronize: true,
    logging: false,
  },
);

export class Pgt {
  public static async connect() {
    await dbDataSource.initialize();
  }

  public static async migrate() {
    await dbDataSource.runMigrations();
  }

  public static get dataSource() {
    return dbDataSource;
  }
}
