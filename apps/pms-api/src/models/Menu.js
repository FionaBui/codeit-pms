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
    updatedBy: String,
    createdBy: String
  },
  { timestamps: true }
);

MenuSchema.pre('validate', function (next) {
  if (this.isNew && !this._id && this.key) {
    this._id = this.key;
  }
  next();
});

export const Menu = mongoose.models.Menu ?? mongoose.model('Menu', MenuSchema);
