import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { apiHandler, createErrorResponse } from '@/lib/api-utils'
import Progress from '@/models/Progress'
import Attempts from '@/models/Attempts'
import Case from '@/models/Case'
import mongoose from 'mongoose'
import axios from 'axios'
import { nanoid } from 'nanoid'

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
  const caseData = await Case.findById(caseId)
  if (!caseData) {
    throw new Error('Case not found')
  }

  // 检查 FastGPT 配置
  const fastgptApiUrl = process.env.FASTGPT_API_URL
  const fastgptApiKey = process.env.FASTGPT_CHAT_API_KEY

  if (!fastgptApiUrl || !fastgptApiKey) {
    throw new Error('FastGPT API 配置缺失')
  }

  // 添加用户消息到对话历史
  const userMessage: ChatMessage = {
    role: 'user',
    content: message.trim(),
    timestamp: new Date()
  }

  const updatedHistory = [...conversationHistory, userMessage]

  // 构建系统提示词，基于案例数据
  const systemPrompt = `你现在要扮演一个名叫"${caseData.customerName}"的客户角色。

客户信息：
- 姓名：${caseData.customerName}  
- 介绍：${caseData.intro}
- 性格特征：${caseData.metaData.personality.join('、')}
- 预算范围：${caseData.metaData.budget}
- 决策级别：${caseData.metaData.decision_level}
- 背景信息：${caseData.metaData.background}
- 关键痛点：${caseData.metaData.points.join('、')}

角色要求：
1. 严格按照上述客户信息的性格特征和背景进行对话
2. 展现出该客户的痛点和需求，但不要过于明显
3. 根据性格特征调整沟通风格（如：谨慎的客户会多问问题，急躁的客户希望快速了解重点）
4. 保持专业且真实的商务对话风格
5. 适当提出符合角色设定的问题和疑虑
6. 不要主动透露所有信息，让销售员通过提问来了解需求
7. 当你认为销售对话已经充分，销售员展现了足够的销售技巧，可以自然地结束对话时，请在回复中包含特殊标记：[CONVERSATION_COMPLETE]

请作为这个客户角色与销售员进行对话。如果对话达到自然的结束点，请添加完成标记。`

  // 调用 FastGPT 获取 AI 回复
  let assistantMessage: ChatMessage
  let fastgptCompletion = false
  
  try {
    // 准备发送给 FastGPT 的消息
    const messages = [
      { role: 'system', content: systemPrompt },
      ...updatedHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ]
    const variables = {
      script: caseData.script
    }

    // 调用 FastGPT API
    const chatId = nanoid()
    const fastgptResponse = await axios.post(`${fastgptApiUrl}/v1/chat/completions`, {
      chatId,
      stream: false,
      detail: false,
      messages,
      variables
    }, {
      headers: {
        'Authorization': `Bearer ${fastgptApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 300000
    })

    const aiContent = fastgptResponse.data.choices?.[0]?.message?.content || 
                     fastgptResponse.data.text || 
                     '抱歉，我现在无法回复，请稍后再试。'

    // 检查 FastGPT 是否返回了完成信号
    fastgptCompletion = fastgptResponse.data.isComplete || 
                       fastgptResponse.data.finished || 
                       aiContent.includes('[CONVERSATION_COMPLETE]') ||
                       false

    // 从显示内容中移除完成标记
    const displayContent = aiContent.replace(/\[CONVERSATION_COMPLETE\]/g, '').trim()

    assistantMessage = {
      role: 'assistant',
      content: displayContent,
      timestamp: new Date()
    }
  } catch (error) {
    console.error('FastGPT API Error:', error)
    
    // FastGPT 调用失败时的降级回复
    assistantMessage = {
      role: 'assistant',
      content: `作为${caseData.customerName}，我现在有点忙，能否简单介绍一下你们的产品？`,
      timestamp: new Date()
    }
  }

  const finalHistory = [...updatedHistory, assistantMessage]

  // 检查对话是否完成（由 FastGPT 返回的响应决定）
  const isComplete = fastgptCompletion

  // 每次对话都保存到 attempts 表中（无论是否完成）
  let attemptData = null
  let progressData = null

  // 查找或创建 attempt 记录
  let attempt = await Attempts.findOne({
    userId: user._id,
    caseId: new mongoose.Types.ObjectId(caseId),
    isComplete: { $ne: true } // 查找未完成的对话
  }).sort({ createdAt: -1 })

  if (attempt) {
    // 更新现有的未完成对话
    attempt.conversationData = { messages: finalHistory }
    if (isComplete) {
      const score = Math.floor((Math.random() * 31) + 70)
      attempt.stars = Math.floor(score / 20)
      attempt.score = score
      attempt.report = generateReport(score, finalHistory)
      attempt.isComplete = true
    }
    await attempt.save()
  } else {
    // 创建新的对话记录（第一条消息）
    const score = isComplete ? Math.floor((Math.random() * 31) + 70) : null
    attempt = new Attempts({
      userId: user._id,
      caseId: new mongoose.Types.ObjectId(caseId),
      stars: isComplete && score ? Math.floor(score / 20) : undefined,
      score: score,
      report: isComplete && score ? generateReport(score, finalHistory) : undefined,
      conversationData: {
        messages: finalHistory
      },
      isComplete: isComplete || false
    })
    await attempt.save()
  }
  
  attemptData = attempt

  if (isComplete) {
      // 更新或创建进度记录
      const existingProgress = await Progress.findOne({
        userId: user._id,
        caseId: new mongoose.Types.ObjectId(caseId)
      })

      if (existingProgress) {
        // 更新现有进度
        existingProgress.totalAttempts += 1
        existingProgress.lastAttemptAt = new Date()
        
        if (attemptData.score > existingProgress.bestScore) {
          existingProgress.bestScore = attemptData.score
          existingProgress.bestStars = attemptData.stars
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
          bestStars: attemptData.stars,
          bestScore: attemptData.score,
          totalAttempts: 1,
          firstCompletedAt: new Date(),
          lastAttemptAt: new Date()
        })

        await newProgress.save()
        progressData = newProgress
      }
    }

  const response = {
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
  
  return response
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