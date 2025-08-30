import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { apiHandler, createErrorResponse } from '@/lib/api-utils'
import Progress from '@/models/Progress'
import Attempts from '@/models/Attempts'
import Case from '@/models/Case'
import mongoose from 'mongoose'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatRequest {
  caseId: string
  message: string
  conversationHistory: ChatMessage[]
}

async function chatHandler(request: NextRequest) {
  await connectDB()
  const user = await requireAuth()
  
  const { caseId, message, conversationHistory }: ChatRequest = await request.json()

  if (!caseId || !message) {
    throw new Error('Case ID and message are required')
  }

  // 验证关卡是否存在
  const caseExists = await Case.findById(caseId)
  if (!caseExists) {
    throw new Error('Case not found')
  }

    // 添加用户消息到对话历史
    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    }

    const updatedHistory = [...conversationHistory, userMessage]

    // 模拟AI回复（暂时返回用户输入的内容）
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: `我收到了您的消息："${message.trim()}"，让我来回应一下...`,
      timestamp: new Date()
    }

    const finalHistory = [...updatedHistory, assistantMessage]

    // 检查是否达到3轮对话（6条消息：3条用户+3条助手）
    const isComplete = finalHistory.length >= 6

    let attemptData = null
    let progressData = null

    if (isComplete) {
      // 随机生成分数和星级
      const score = Math.floor(Math.random() * 31) + 70 // 70-100分
      const stars = Math.floor(score / 20) // 分数转星级

      // 生成评价报告
      const report = generateReport(score, finalHistory)

      // 保存本次尝试记录
      const attempt = new Attempts({
        userId: user._id,
        caseId: new mongoose.Types.ObjectId(caseId),
        stars,
        score,
        report,
        conversationData: {
          messages: finalHistory
        }
      })

      await attempt.save()
      attemptData = attempt

      // 更新或创建进度记录
      const existingProgress = await Progress.findOne({
        userId: user._id,
        caseId: new mongoose.Types.ObjectId(caseId)
      })

      if (existingProgress) {
        // 更新现有进度
        existingProgress.totalAttempts += 1
        existingProgress.lastAttemptAt = new Date()
        
        if (score > existingProgress.bestScore) {
          existingProgress.bestScore = score
          existingProgress.bestStars = stars
        }

        if (!existingProgress.firstCompletedAt) {
          existingProgress.firstCompletedAt = new Date()
        }

        await existingProgress.save()
        progressData = existingProgress
      } else {
        // 创建新进度记录
        const newProgress = new Progress({
          userId: user._id,
          caseId: new mongoose.Types.ObjectId(caseId),
          bestStars: stars,
          bestScore: score,
          totalAttempts: 1,
          firstCompletedAt: new Date(),
          lastAttemptAt: new Date()
        })

        await newProgress.save()
        progressData = newProgress
      }
    }

  return {
    message: assistantMessage,
    conversationHistory: finalHistory,
    isComplete,
    result: isComplete ? {
      stars: attemptData?.stars,
      score: attemptData?.score,
      report: attemptData?.report,
      totalAttempts: progressData?.totalAttempts,
      bestScore: progressData?.bestScore
    } : null
  }
}

export const POST = apiHandler(chatHandler)

function generateReport(score: number, conversationHistory: ChatMessage[]): string {
  const userMessages = conversationHistory.filter(msg => msg.role === 'user')
  
  let report = `本次销售对练评价报告：\n\n`
  
  if (score >= 90) {
    report += `🎉 优秀表现！您在本次对练中展现了出色的销售技巧。\n\n`
  } else if (score >= 80) {
    report += `👏 良好表现！您的销售沟通能力不错，还有提升空间。\n\n`
  } else {
    report += `💪 继续努力！通过更多练习可以提升您的销售技能。\n\n`
  }

  report += `评分详情：\n`
  report += `• 总体得分：${score}分\n`
  report += `• 沟通轮次：${userMessages.length}轮\n`
  report += `• 回复质量：${score >= 85 ? '优秀' : score >= 75 ? '良好' : '一般'}\n`
  report += `• 互动效果：${score >= 85 ? '很好' : score >= 75 ? '不错' : '需改进'}\n\n`
  
  report += `改进建议：\n`
  if (score < 85) {
    report += `• 可以更主动地了解客户需求\n`
    report += `• 尝试提供更具体的解决方案\n`
    report += `• 加强与客户的情感连接\n`
  } else {
    report += `• 保持现有的优秀表现\n`
    report += `• 继续深化产品知识\n`
    report += `• 可以尝试更复杂的销售场景\n`
  }

  return report
}