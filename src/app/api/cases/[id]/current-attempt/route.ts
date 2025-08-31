import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { apiHandler } from '@/lib/api-utils'
import Attempts from '@/models/Attempts'
import mongoose from 'mongoose'

async function getCurrentAttemptHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()
  const user = await requireAuth()
  const { id: caseId } = await params

  // 获取该用户该案例的最新未完成对话记录
  const latestAttempt = await Attempts.findOne({
    userId: user._id,
    caseId: new mongoose.Types.ObjectId(caseId),
    isComplete: { $ne: true } // 获取未完成的对话
  })
  .sort({ createdAt: -1 }) // 按创建时间倒序，获取最新的
  .lean()

  if (!latestAttempt) {
    return {
      hasAttempt: false,
      messages: [],
      isComplete: false,
      result: null
    }
  }

  return {
    hasAttempt: true,
    messages: latestAttempt.conversationData?.messages || [],
    isComplete: latestAttempt.isComplete || false,
    result: latestAttempt.isComplete ? {
      stars: latestAttempt.stars,
      score: latestAttempt.score,
      report: latestAttempt.report,
      totalAttempts: 1, // 这里可以后续优化为实际的尝试次数
      bestScore: latestAttempt.score
    } : null,
    attemptId: latestAttempt._id
  }
}

export const GET = apiHandler(getCurrentAttemptHandler)