import mongoose from 'mongoose';
import { slugify } from '@codeit/utils';

const { Schema } = mongoose;

const ResourceSchema = new Schema(
  {
    _id: {
      type: String
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

ResourceSchema.pre('save', async function (next) {
  if (this.isNew && !this._id && this.name) {
    this._id = slugify(this.name);
    const resource = await Resource.findOne({ name: this.name }).sort({
      createdAt: -1
    });
    if (resource) {
      let number = +resource._id.split('-').at(-1);
      if (!number) number = 0;
      this._id += '-' + ++number;
    }
  }

  next();
});

export const Resource =
  mongoose.models.Resource ?? mongoose.model('Resource', ResourceSchema);
