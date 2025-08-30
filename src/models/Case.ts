import mongoose, { Document, Schema } from 'mongoose'

export interface ICase extends Document {
  _id: string
  customerName: string
  intro: string
  avatar: string
  orderIndex: number
  metaData: {
    budget: string
    decision_level: string
    personality: string[]
    points: string[]
    background: string
  }
  script?: string
  createdAt: Date
}

const CaseSchema: Schema = new Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    intro: {
      type: String,
      required: [true, 'Intro is required'],
      trim: true,
    },
    avatar: {
      type: String,
      required: [true, 'Avatar is required'],
    },
    orderIndex: {
      type: Number,
      required: [true, 'Order index is required'],
      unique: true,
      index: true,
    },
    metaData: {
      budget: {
        type: String,
        required: true,
      },
      decision_level: {
        type: String,
        required: true,
      },
      personality: [{
        type: String,
        required: true,
      }],
      points: [{
        type: String,
        required: true,
      }],
      background: {
        type: String,
        required: true,
      },
    },
    script: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
)

// 创建额外索引
CaseSchema.index({ customerName: 1 })

export default mongoose.models.Case || mongoose.model<ICase>('Case', CaseSchema)