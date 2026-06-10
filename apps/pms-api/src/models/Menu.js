import mongoose from 'mongoose';

const { Schema } = mongoose;

const MenuSchema = new Schema(
  {
    _id: {
      type: String
    },
    label: {
      type: String,
      trim: true
    },
    order: {
      type: Number,
      required: true
    },
    group: {
      type: String,
      enum: ['dashboard', 'management'],
      default: 'dashboard'
    },
    allowedTitles: {
      type: [String],
      default: []
    },
    allowedRoles: {
      type: [String],
      default: []
    },
    updatedBy: String,
    createdBy: String
  },
  { timestamps: true }
);

export const Menu = mongoose.models.Menu ?? mongoose.model('Menu', MenuSchema);
