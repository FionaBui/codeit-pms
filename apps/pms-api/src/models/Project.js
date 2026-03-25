import mongoose from 'mongoose';
import { slugify } from '@codeit/utils';

const { Schema } = mongoose;

const ProjectSchema = new Schema(
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
    shortName: {
      type: String,
      required: true,
      maxlength: 50
    },
    type: {
      type: String,
      enum: [
        "Type 1: new development outside Core Services",
        "Type 2: development / improvements inside Core Services",
        "Type 3: Customizations & Change requests",
        "Type 4: Daily support & Continuous improvements"
      ],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    plannedManhours: {
      type: Number,
      required: true
    },
    actualManhours: Number,
    status: {
      type: String,
      enum: ["plan", "execution", "closing", "finished"],
      required: true
    },
    completion: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    },
    updatedBy: String,
    createdBy: String
  },
  { timestamps: true }
);

ProjectSchema.pre('save', function (next) {
  if (this.isNew && !this._id && this.shortName) {
    this._id = slugify(this.shortName);
  }
  next();
});

ProjectSchema.index({ name: 1 }, { unique: true });

export const Project =
  mongoose.models.Project ?? mongoose.model('Project', ProjectSchema);
