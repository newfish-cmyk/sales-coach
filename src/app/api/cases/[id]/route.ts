import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Case from '@/models/Case'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await connectDB()

    const case_ = await Case.findById(id).select('-__v')

    if (!case_) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    return NextResponse.json({ case: case_ })
  } catch (error) {
    console.error('Get case error:', error)
    return NextResponse.json({ error: 'Failed to fetch case' }, { status: 500 })
  }
}
