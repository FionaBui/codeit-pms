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
      // required: true,
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
  console.log('this:', this);
  if (this.isNew && !this._id && this.name) {
    this._id = slugify(this.name);
    console.log('this._id: ', this._id);
    // const resource = await Resource.findOne({ _id: this._id });
    // console.log('resource: ', resource);
    // if (resource) {
    //   let number = +resource.id.split('-').at(-1);
    //   if (!number) number = 0;
    //   console.log(`number:`, number);
    //   this._id += '-' + ++number;
    // }
  }

  next();
});

ResourceSchema.index({ name: 1 });

export const Resource =
  mongoose.models.Resource ?? mongoose.model('Resource', ResourceSchema);
