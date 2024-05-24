import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

// TypeOrm doesn't support column ordering,
// so this columns will appear from the beggining of the extended entity
export abstract class BaseEntity {
  @CreateDateColumn({ name: 'created_at' })
  public createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  public deletedAt?: Date;
}
