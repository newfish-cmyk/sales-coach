import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Case from '@/models/Case'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const cases = await Case.find({ })
      .sort({ orderIndex: 1 })
      .select('-__v')

    return NextResponse.json({ cases })
  } catch (error: any) {
    console.error('Get cases error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cases' },
      { status: 500 }
    )
  }
}