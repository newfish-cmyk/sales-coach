import { Case } from '@/types'

export async function getCases(): Promise<Case[]> {
  try {
    const response = await fetch('/api/cases')
    if (!response.ok) {
      throw new Error('Failed to fetch cases')
    }
    const data = await response.json()
    return data.cases
  } catch (error) {
    console.error('Error fetching cases:', error)
    return []
  }
}

export async function getCase(id: string): Promise<Case | null> {
  try {
    const response = await fetch(`/api/cases/${id}`)
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    return data.case
  } catch (error) {
    console.error('Error fetching case:', error)
    return null
  }
}