import connectDB from '@/lib/mongodb'
import { apiHandler } from '@/lib/api-utils'
import Case from '@/models/Case'

async function getCasesHandler() {
  await connectDB()

  const cases = await Case.find({})
    .lean() // Use lean for better performance
    .sort({ orderIndex: 1 })
    .select('-__v')

  return cases
}

export const GET = apiHandler(getCasesHandler)

// Cache cases data for 5 minutes since it changes infrequently
export const revalidate = 300