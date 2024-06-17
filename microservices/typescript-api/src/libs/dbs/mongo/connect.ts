import mongoose, { model, Schema } from 'mongoose';
import config = require('config');
import { Migration } from './migration';
import { ExampleMigration } from './migrations/example.migration';

const USER = config.get<string>('db.mongo.user');
const PASSWORD = config.get<string>('db.mongo.password');
const URL = config.get<string>('db.mongo.url');

const MigrationSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

const MigrationModel = model('DbMigration', MigrationSchema);

export class Mongo {
  private static migrations: Migration[] = [
    new ExampleMigration(),
  ];

  public static async connect(): Promise<void> {
    const cfg = {
      // autoIndex must be true if you want to index on each startup
      autoIndex: true,
      user: USER,
      pass: PASSWORD,
    };

    mongoose.set('debug', false);
    mongoose.set('strictQuery', false);

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected');
    });
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

    await mongoose.connect(URL, cfg);

    await this.migrateAll();
  }

  private static async migrateAll(): Promise<void> {
    for (const m of this.migrations.sort((m1, m2) => m1.id - m2.id)) {
      // eslint-disable-next-line no-await-in-loop
      if (!(await this.migrationExists(m))) {
        console.log(`Migration with ${m.id} id is already exist, skipping`);
        continue;
      }

      console.log(`Running migration with ${m.id} id`);
      // eslint-disable-next-line no-await-in-loop
      await this.migrate(m);

      console.log('Migration completed succesfully');
    }
  }

  private static async migrationExists(m: Migration): Promise<boolean> {
    return Boolean((await MigrationModel.find({ id: m.id })).length);
  }

  private static async migrate(m: Migration): Promise<void> {
    const session = await mongoose.startSession();
    console.log('Starting transaction');
    session.startTransaction();
    try {
      await m.up(session);

      const migration = new MigrationModel({ id: m.id });
      await migration.save();

      console.log('Committing transaction');
      await session.commitTransaction();
      await session.endSession();
    } catch (e) {
      console.log('Error:', (<Error>e).message);
      console.log('Aborting transaction');
      await session.abortTransaction();
      session.endSession();

      throw e;
    }
  }

  // TODO: Add down migration
}
