import {
  Model, model, Schema,
} from 'mongoose';

export interface ISoftDeletable {
  deleted?: boolean,
  deletedAt?: Date,
  softDelete(): Promise<unknown>,
}

export interface IExample {
  // TODO: interfate here
  deleted: {
    type: Boolean,
    default: false,
    select: false,
  },
  deletedAt: {
    type: Date,
    required: false,
    select: false,
  },
}

type ExampleModelType = Model<IExample, {}, ISoftDeletable>;

export const ExampleSchema = new Schema<IExample, ExampleModelType, ISoftDeletable>({
  // TODO: schema here
}, { timestamps: true });

// Unique index
ExampleSchema.index({
  // TODO: index here
}, { unique: true });

// An instance method to soft delete the document
// eslint-disable-next-line func-names
ExampleSchema.method('softDelete', function softDelete() {
  this.deleted = true;

  return this.save();
});

// pre-save hook to set the deleted or failed flag
// eslint-disable-next-line func-names
ExampleSchema.pre('save', function preSave(next) {
  if (this.isModified('deleted') && this.deleted) {
    this.deletedAt = new Date();
  }

  return next();
});

// pre-find hooks to find only non-deleted documents
// eslint-disable-next-line func-names
ExampleSchema.pre(['find', 'findOne', 'countDocuments'], function findNotDeleted() {
  this.where({ deleted: false });
});

// convert object
ExampleSchema.set('toJSON', {
  transform: (_, ret) => {
    const {
      _id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      __v,
      ...obj
    } = ret;

    return { id: String(_id), ...obj };
  },
});

export const ExampleModel = model('Example', ExampleSchema);

ExampleModel.on('index', (e) => {
  if (!e) {
    return;
  }
  console.error('Error:', e.message);
});
