export interface SalesItem {
  id: string
  title: string
  description: string
  status: 'active' | 'pending' | 'completed'
  priority: 'high' | 'medium' | 'low'
  createdAt: string
  updatedAt: string
  // New properties for roadmap design
  name: string
  avatar?: string
  difficulty: 'easy' | 'medium' | 'hard'
  stars: number
  maxStars: number
  isCompleted: boolean
  isLocked: boolean
  customerType: string
}

export interface ListPageProps {
  items: SalesItem[]
  loading?: boolean
}

export interface DetailPageProps {
  item: SalesItem
  loading?: boolean
}