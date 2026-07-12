import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, trim: true },
    bullets: [{ type: String, trim: true }],
  },
  { _id: true }
);

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    grade: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    technologies: [{ type: String, trim: true }],
    link: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    bullets: [{ type: String, trim: true }],
  },
  { _id: true }
);

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' },
  },
  { _id: true }
);

const languageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    proficiency: { type: String, enum: ['basic', 'conversational', 'fluent', 'native'], default: 'conversational' },
  },
  { _id: true }
);

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, trim: true },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    credentialUrl: { type: String, trim: true },
  },
  { _id: true }
);

const awardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, trim: true },
    date: { type: Date },
    description: { type: String, trim: true },
  },
  { _id: true }
);

const referenceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, trim: true },
    company: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  { _id: true }
);

const customSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Resume title is required'],
      trim: true,
      default: 'Untitled Resume',
    },
    template: {
      type: String,
      enum: ['classic', 'creative', 'executive', 'minimal'],
      default: 'classic',
    },

    personalInfo: {
      fullName: { type: String, trim: true },
      jobTitle: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      country: { type: String, trim: true },
      website: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      photoUrl: { type: String, trim: true },
    },

    professionalSummary: { type: String, trim: true },

    experience: [experienceSchema],
    education: [educationSchema],
    projects: [projectSchema],
    skills: [skillSchema],
    languages: [languageSchema],
    certifications: [certificationSchema],
    awards: [awardSchema],
    references: [referenceSchema],
    customSections: [customSectionSchema],

    sectionOrder: {
      type: [String],
      default: [
        'personalInfo',
        'professionalSummary',
        'experience',
        'education',
        'projects',
        'skills',
        'languages',
        'certifications',
        'awards',
        'references',
      ],
    },

    isPublic: { type: Boolean, default: false },
    publicSlug: { type: String, unique: true, sparse: true },

    lastEditedAt: { type: Date, default: Date.now },
    currentVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);

resumeSchema.index({ user: 1, createdAt: -1 });

resumeSchema.pre('save', function generateSlug(next) {
  if (this.isPublic && !this.publicSlug) {
    this.publicSlug = nanoid(10);
  }
  next();
});

export const Resume = mongoose.model('Resume', resumeSchema);
