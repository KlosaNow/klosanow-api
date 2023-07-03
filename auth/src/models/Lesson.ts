import mongoose from 'mongoose';
import { LessonTypes } from '../utils/types';

const LessonSchema = new mongoose.Schema<LessonTypes>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a lesson title'],
    },
    about: {
        type: String,
        required: [true, 'Please provide a lesson about'],
    },
    content: {
      type: String,
      required: [true, 'Please include a lesson content'],
    },
    videoUrl: {
      type: String,
      required: [true, 'Please include a video url'],
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Please include a thumbnail url'],
    },
    tag: {
      type: String,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    videoSize: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Lesson', LessonSchema);
