import { ClientSession } from 'mongoose';

export abstract class Migration {
  // Please use new Date().getTime() in node REPL and add it as id when implementing a new migration class
  constructor(private mId: number) {}

  public get id(): number {
    return this.mId;
  }

  public abstract up(session: ClientSession): Promise<void>;

  public abstract down(session: ClientSession): Promise<void>;
}
