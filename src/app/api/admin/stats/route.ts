import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Case from '@/models/Case'
import { requireAdminAuth } from '@/lib/auth'
import { getCachedData, setCachedData } from '@/lib/api-utils'

export async function GET() {
  try {
    await requireAdminAuth()
    await connectDB()

    // 检查缓存 (缓存30秒，管理员数据不需要实时性)
    const cacheKey = 'admin_stats'
    const cached = getCachedData(cacheKey)
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, max-age=30'
        }
      })
    }

    const [userCount, caseCount, adminCount] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Case.countDocuments(),
      User.countDocuments({ role: 'admin' })
    ])

    const recentUsers = await User.find({ role: 'user' })
      .select('username createdAt')
      .lean()
      .sort({ createdAt: -1 })
      .limit(5)

    const result = {
      stats: {
        userCount,
        caseCount,
        adminCount,
        totalUsers: userCount + adminCount
      },
      recentUsers: recentUsers.map(user => ({
        id: user._id,
        username: user.username,
        createdAt: user.createdAt
      }))
    }

    // 缓存结果30秒
    setCachedData(cacheKey, result, 30000)

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=30'
      }
    })
  } catch (error) {
    console.error('Get admin stats error:', error)
    return NextResponse.json(
      { error: 'Unauthorized or internal server error' },
      { status: error.message === 'Admin access required' ? 403 : 500 }
    )
  }
}