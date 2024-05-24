import { Migration } from '../migration';

export class ExampleMigration extends Migration {
  constructor() {
    super(1700000000000);
  }

  // eslint-disable-next-line class-methods-use-this
  public async up(): Promise<void> {
    // TODO: migration here
  }

  // eslint-disable-next-line class-methods-use-this
  public async down(): Promise<void> {
    // TODO: undo migration here
  }
}
