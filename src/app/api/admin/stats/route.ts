import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Case from '@/models/Case'
import { requireAdminAuth } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdminAuth()
    await connectDB()

    const [userCount, caseCount, adminCount] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Case.countDocuments(),
      User.countDocuments({ role: 'admin' })
    ])

    const recentUsers = await User.find({ role: 'user' })
      .select('username createdAt')
      .sort({ createdAt: -1 })
      .limit(5)

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error('Get admin stats error:', error)
    return NextResponse.json(
      { error: 'Unauthorized or internal server error' },
      { status: error.message === 'Admin access required' ? 403 : 500 }
    )
  }
}