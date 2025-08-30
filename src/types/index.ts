// 数据库Case数据结构
export interface Case {
  _id: string
  customerName: string
  intro: string
  avatar: string
  orderIndex: number
  metaData: {
    budget: string
    decision_level: string
    personality: string[]
    points: string[]
    background: string
  }
  createdAt: string
}

export interface ListPageProps {
  items: Case[]
  loading?: boolean
}

export interface DetailPageProps {
  item: Case
  loading?: boolean
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatResult {
  stars: number
  score: number
  report: string
  totalAttempts: number
  bestScore: number
}