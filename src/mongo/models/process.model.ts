import mongoose from 'mongoose';

const processSchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  currentStep: {
    type: String,
    default: 'REVIEWING',
    enum: ['REVIEWING', 'ACTION_REQUIRED', 'COMPLETED']
  },
  notes: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

processSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export const ProcessModel = mongoose.model('Process', processSchema);