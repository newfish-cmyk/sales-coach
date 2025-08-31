import mongoose, { Document, Schema } from 'mongoose'

interface IMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface IAttempts extends Document {
  _id: string
  userId: mongoose.Types.ObjectId
  caseId: mongoose.Types.ObjectId
  stars?: number
  score?: number
  report?: string
  conversationData: {
    messages: IMessage[]
  }
  isComplete?: boolean
  createdAt: Date
}

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, { _id: false })

const AttemptsSchema: Schema = new Schema(
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
    stars: {
      type: Number,
      required: false,
      min: [0, 'Stars cannot be negative'],
      max: [5, 'Stars cannot exceed 5'],
    },
    score: {
      type: Number,
      required: false,
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
    },
    report: {
      type: String,
      required: false,
      trim: true,
    },
    isComplete: {
      type: Boolean,
      required: false,
      default: false,
    },
    conversationData: {
      messages: [MessageSchema],
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

// 创建索引优化查询
AttemptsSchema.index({ userId: 1, caseId: 1 })
AttemptsSchema.index({ userId: 1, caseId: 1, isComplete: 1 })
AttemptsSchema.index({ createdAt: -1 })

export default mongoose.models.Attempts || mongoose.model<IAttempts>('Attempts', AttemptsSchema)