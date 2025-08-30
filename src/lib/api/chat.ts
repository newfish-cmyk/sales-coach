import { http } from '../http'
import { ChatMessage, ChatResult } from '@/types'

// 聊天接口请求参数
export interface ChatRequest {
  caseId: string
  message: string
  conversationHistory: ChatMessage[]
}

// 聊天接口响应数据
export interface ChatResponse {
  message: ChatMessage
  conversationHistory: ChatMessage[]
  isComplete: boolean
  result: ChatResult | null
}

// 发送聊天消息
export const sendChatMessage = (data: ChatRequest): Promise<ChatResponse> => 
  http.post<ChatResponse>('/chat', data)