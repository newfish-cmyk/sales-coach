import { SalesItem } from '@/types'

export const mockData: SalesItem[] = [
  {
    id: '1',
    title: '客户跟进 - ABC公司',
    description: '一位友善的初次购买客户，容易建立信任关系',
    status: 'completed',
    priority: 'high',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    name: '友好的张先生',
    avatar: '/avatars/friendly-businessman-avatar.png',
    difficulty: 'easy',
    stars: 4,
    maxStars: 5,
    isCompleted: true,
    isLocked: false,
    customerType: '新客户'
  },
  {
    id: '2',
    title: '提案准备 - XYZ集团',
    description: '对产品细节要求较高，需要耐心解答',
    status: 'completed',
    priority: 'medium',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T11:20:00Z',
    name: '挑剔的李女士',
    avatar: '/avatars/professional-businesswoman-avatar.png',
    difficulty: 'easy',
    stars: 4,
    maxStars: 5,
    isCompleted: true,
    isLocked: false,
    customerType: '细节型客户'
  },
  {
    id: '3',
    title: '合同签署 - DEF企业',
    description: '决策谨慎，需要更多说服和价值展示',
    status: 'active',
    priority: 'low',
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    name: '犹豫的王总',
    avatar: '/avatars/executive-businessman-avatar.png',
    difficulty: 'medium',
    stars: 3,
    maxStars: 5,
    isCompleted: false,
    isLocked: false,
    customerType: '决策者'
  },
  {
    id: '4',
    title: '急躁的陈经理',
    description: '时间紧迫，需要快速抓住重点',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-12T08:00:00Z',
    updatedAt: '2024-01-23T10:15:00Z',
    name: '急躁的陈经理',
    avatar: '/avatars/busy-manager-avatar.png',
    difficulty: 'medium',
    stars: 0,
    maxStars: 5,
    isCompleted: false,
    isLocked: false,
    customerType: '时间敏感型'
  },
  {
    id: '5',
    title: '专业的刘博士',
    description: '技术专家，需要深度的专业知识交流',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-01-08T16:00:00Z',
    updatedAt: '2024-01-25T12:30:00Z',
    name: '专业的刘博士',
    avatar: '/avatars/professional-doctor-avatar.png',
    difficulty: 'hard',
    stars: 0,
    maxStars: 5,
    isCompleted: false,
    isLocked: true,
    customerType: '专家型客户'
  },
  {
    id: '6',
    title: '苛刻的周总监',
    description: '要求极高，对价格和服务都很挑剔',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-01-03T13:00:00Z',
    updatedAt: '2024-01-26T14:20:00Z',
    name: '苛刻的周总监',
    avatar: '/avatars/stern-supervisor-avatar.png',
    difficulty: 'hard',
    stars: 0,
    maxStars: 5,
    isCompleted: false,
    isLocked: true,
    customerType: '挑战型客户'
  }
]

export async function getSalesItems(): Promise<SalesItem[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockData
}

export async function getSalesItem(id: string): Promise<SalesItem | null> {
  await new Promise(resolve => setTimeout(resolve, 50))
  return mockData.find(item => item.id === id) || null
}