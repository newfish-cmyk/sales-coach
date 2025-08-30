import { http } from '../http'
import { UserProgressData } from '@/types'

// 获取用户进度数据
export const getUserProgress = (): Promise<UserProgressData> => 
  http.get<UserProgressData>('/progress')