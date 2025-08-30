import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import { apiHandler } from '@/lib/api-utils'
import Case from '@/models/Case'

async function getCaseHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await connectDB()

  const case_ = await Case.findById(id).select('-__v')

  if (!case_) {
    throw new Error('Case not found')
  }

  return case_
}

export const GET = apiHandler(getCaseHandler)
