import { Case, ChatMessage, ChatResult } from '@/types'

interface ChatResponse {
  success: boolean
  message: ChatMessage
  conversationHistory: ChatMessage[]
  isComplete: boolean
  result: ChatResult | null
}

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

export async function sendChatMessage(
  caseId: string, 
  message: string, 
  conversationHistory: ChatMessage[]
): Promise<ChatResponse | null> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        caseId,
        message,
        conversationHistory
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send chat message')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error sending chat message:', error)
    return null
  }
}