import mongoose from 'mongoose';
import { slugify } from '@codeit/utils';

const { Schema } = mongoose;

const ResourceSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true
    },
    title: {
      type: String,
      maxlength: 100,
      trim: true
    },
    updatedBy: String,
    createdBy: String
  },
  { timestamps: true }
);

ResourceSchema.pre('save', function (next) {
  if (this.isNew && !this._id && this.name) {
    this._id = slugify(this.name);
  }
  next();
});

ResourceSchema.index({ name: 1 }, { unique: true });

export const Resource =
  mongoose.models.Resource ?? mongoose.model('Resource', ResourceSchema);
