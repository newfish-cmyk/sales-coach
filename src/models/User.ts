import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  _id: string
  username: string
  password: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)