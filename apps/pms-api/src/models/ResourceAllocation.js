import mongoose from 'mongoose';

const { Schema } = mongoose;

const AllocationItemSchema = new Schema(
  {
    month: {
      type: Date,
      required: true
    },
    percent: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    }
  },
  { _id: false }
);

const ResourceAllocationSchema = new Schema(
  {
    resource: {
      type: String,
      ref: 'Resource',
      required: true
    },
    project: {
      type: String,
      ref: 'Project',
      required: true
    },
    allocation: {
      type: [AllocationItemSchema],
      default: []
    },
    updatedBy: String,
    createdBy: String
  },
  { timestamps: true }
);

function utcMonthStart(d) {
  const x = new Date(d);
  return new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), 1));
}

/** Dedupe by calendar month (UTC), last wins; sort by month. Used by save hook and insertMany seeding. */
export function normalizeAllocation(allocation) {
  if (!allocation?.length) return [];
  const byKey = new Map();
  for (const item of allocation) {
    const m = utcMonthStart(item.month);
    byKey.set(m.getTime(), { month: m, percent: item.percent });
  }
  return Array.from(byKey.values()).sort((a, b) => a.month - b.month);
}

ResourceAllocationSchema.pre('save', function (next) {
  if (this.allocation?.length) {
    this.allocation = normalizeAllocation(this.allocation);
  }
  next();
});

ResourceAllocationSchema.index({ resource: 1, project: 1 }, { unique: true });
ResourceAllocationSchema.index({ resource: 1 });
ResourceAllocationSchema.index({ project: 1 });
ResourceAllocationSchema.index({ 'allocation.month': 1 });

export const ResourceAllocation =
  mongoose.models.ResourceAllocation ??
  mongoose.model('resource-allocation', ResourceAllocationSchema);
