import {
  Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../libs/dbs/pgt/base.entity';
// eslint-disable-next-line import/no-cycle

@Entity({ name: 'examples' })
export class Example extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id?: number;

  @Column({ type: 'varchar', name: 'customer_id', nullable: false })
  public field?: string;
}
