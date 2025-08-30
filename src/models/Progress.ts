import mongoose, { Document, Schema } from 'mongoose'

export interface IProgress extends Document {
  _id: string
  userId: mongoose.Types.ObjectId
  caseId: mongoose.Types.ObjectId
  bestStars: number
  bestScore: number
  totalAttempts: number
  firstCompletedAt?: Date
  lastAttemptAt: Date
  createdAt: Date
}

const ProgressSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    caseId: {
      type: Schema.Types.ObjectId,
      ref: 'Case',
      required: [true, 'Case ID is required'],
      index: true,
    },
    bestStars: {
      type: Number,
      required: true,
      min: [0, 'Stars cannot be negative'],
      max: [5, 'Stars cannot exceed 5'],
      default: 0,
    },
    bestScore: {
      type: Number,
      required: true,
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
      default: 0,
    },
    totalAttempts: {
      type: Number,
      required: true,
      min: [0, 'Attempts cannot be negative'],
      default: 0,
    },
    firstCompletedAt: {
      type: Date,
      default: null,
    },
    lastAttemptAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
)

// 创建复合索引确保每个用户每个关卡只有一条进度记录
ProgressSchema.index({ userId: 1, caseId: 1 }, { unique: true })

export default mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema)