import { http } from '../http'
import { Case } from '@/types'

// 获取所有关卡列表
export const getCases = (): Promise<Case[]> => 
  http.get<Case[]>('/cases')

// 根据ID获取关卡详情
export const getCaseById = (id: string): Promise<Case> => 
  http.get<Case>(`/cases/${id}`)