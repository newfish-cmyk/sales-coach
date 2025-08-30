import { http } from '../http'

// 用户信息接口
export interface User {
  _id: string
  username: string
  createdAt: string
}

// 登录请求参数
export interface LoginRequest {
  username: string
  password: string
}

// 注册请求参数
export interface RegisterRequest {
  username: string
  password: string
}

// 用户登录
export const login = (data: LoginRequest): Promise<{ user: User }> => 
  http.post<{ user: User }>('/auth/login', data)

// 用户注册
export const register = (data: RegisterRequest): Promise<{ user: User }> => 
  http.post<{ user: User }>('/auth/register', data)

// 获取当前用户会话
export const getSession = (): Promise<{ user: User }> => 
  http.get<{ user: User }>('/auth/session')

// 用户登出
export const logout = (): Promise<void> => 
  http.post<void>('/auth/logout')