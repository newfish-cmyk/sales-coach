import connectDB from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { apiHandler } from '@/lib/api-utils'
import Progress from '@/models/Progress'
import Case from '@/models/Case'

async function progressHandler() {
  await connectDB()
  const user = await requireAuth()

  // 简化：去除服务端缓存，交由客户端处理

    // 获取所有关卡 (使用lean()提升性能)
    const cases = await Case.find({}).lean().sort({ orderIndex: 1 })
    
    // 获取用户的所有进度记录 (使用lean()提升性能)
    const progressRecords = await Progress.find({ userId: user._id }).lean()

    // 创建进度映射 (caseId直接是ObjectId，不需要populate)
    const progressMap = new Map()
    progressRecords.forEach(progress => {
      if (progress.caseId) {
        progressMap.set(progress.caseId.toString(), progress)
      }
    })

    // 计算统计数据
    let completedCount = 0
    let totalStars = 0
    let totalAttempts = 0

    const progressData = cases.map(case_ => {
      const progress = progressMap.get((case_._id as any).toString())
      const isCompleted = progress && progress.firstCompletedAt
      const stars = progress ? progress.bestStars : 0
      const score = progress ? progress.bestScore : 0
      const attempts = progress ? progress.totalAttempts : 0

      if (isCompleted) completedCount++
      totalStars += stars
      totalAttempts += attempts

      return {
        caseId: case_._id as any,
        orderIndex: case_.orderIndex,
        customerName: case_.customerName,
        intro: case_.intro,
        avatar: case_.avatar,
        metaData: case_.metaData,
        progress: {
          isCompleted: !!isCompleted,
          bestStars: stars,
          bestScore: score,
          totalAttempts: attempts,
          firstCompletedAt: progress?.firstCompletedAt || null,
          lastAttemptAt: progress?.lastAttemptAt || null
        },
        isLocked: false // 将在下面的循环中设置
      }
    })

    // 计算解锁逻辑：顺序解锁，完成前一关才能解锁下一关
    let lastUnlocked = 0
    progressData.forEach((item, index) => {
      if (index === 0) {
        // 第一关总是解锁的
        item.isLocked = false
        if (item.progress.isCompleted) {
          lastUnlocked = index + 1
        }
      } else {
        // 后续关卡需要前一关完成才能解锁
        item.isLocked = index > lastUnlocked
        if (item.progress.isCompleted && !item.isLocked) {
          lastUnlocked = index + 1
        }
      }
    })

    const maxTotalStars = cases.length * 5
    const completionPercentage = maxTotalStars > 0 ? Math.round((totalStars / maxTotalStars) * 100) : 0

  const result = {
    cases: progressData,
    summary: {
      completedCount,
      totalStars,
      maxTotalStars,
      completionPercentage,
      totalAttempts,
      totalCases: cases.length
    }
  }

  return result
}

export const GET = apiHandler(progressHandler)

// Add caching to improve performance
export const revalidate = 30 // Revalidate every 30 seconds