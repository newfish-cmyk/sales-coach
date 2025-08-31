import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { apiHandler } from '@/lib/api-utils'
import Attempts from '@/models/Attempts'
import mongoose from 'mongoose'

async function abandonAttemptHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()
  const user = await requireAuth()
  const { id: caseId } = await params

  // 查找并删除当前用户该案例的未完成 attempt
  const result = await Attempts.deleteMany({
    userId: user._id,
    caseId: new mongoose.Types.ObjectId(caseId),
    isComplete: { $ne: true } // 只删除未完成的对话
  })

  return {
    success: true,
    deletedCount: result.deletedCount,
    message: '已放弃当前对话，可以开始新的练习'
  }
}

export const POST = apiHandler(abandonAttemptHandler)