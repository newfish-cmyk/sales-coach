import connectDB from '@/lib/mongodb'
import { apiHandler } from '@/lib/api-utils'
import Case from '@/models/Case'

async function getCasesHandler() {
  await connectDB()

  const cases = await Case.find({})
    .sort({ orderIndex: 1 })
    .select('-__v')

  return cases
}

export const GET = apiHandler(getCasesHandler)