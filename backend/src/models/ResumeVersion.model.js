import mongoose from 'mongoose';

const resumeVersionSchema = new mongoose.Schema(
  {
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    versionNumber: { type: Number, required: true },
    snapshot: { type: mongoose.Schema.Types.Mixed, required: true }, // pura resume data ka copy
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    changeNote: { type: String, trim: true },
  },
  { timestamps: true }
);

resumeVersionSchema.index({ resume: 1, versionNumber: -1 });

export const ResumeVersion = mongoose.model('ResumeVersion', resumeVersionSchema);