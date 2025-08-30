import { NextResponse } from 'next/server'
import { ApiResponse } from './http'

// 创建成功响应
export function createSuccessResponse<T>(
  data: T,
  message: string = 'Success',
  code: number = 200
): NextResponse {
  const response: ApiResponse<T> = {
    code,
    message,
    data,
    success: true
  }
  return NextResponse.json(response, { status: code })
}

// 创建错误响应
export function createErrorResponse(
  message: string,
  code: number = 500,
  data: any = null
): NextResponse {
  const response: ApiResponse = {
    code,
    message,
    data,
    success: false
  }
  return NextResponse.json(response, { status: code })
}

// API处理器包装器
export function apiHandler(
  handler: (request: any, context?: any) => Promise<any>
) {
  return async (request: any, context?: any) => {
    try {
      const result = await handler(request, context)
      return createSuccessResponse(result)
    } catch (error) {
      console.error('API Error:', error)
      
      if (error instanceof Error) {
        // 处理已知错误类型
        if (error.message === 'Authentication required') {
          return createErrorResponse('认证失败', 401)
        }
        if (error.message.includes('not found')) {
          return createErrorResponse('资源未找到', 404)
        }
        
        return createErrorResponse(error.message, 500)
      }
      
      return createErrorResponse('服务器内部错误', 500)
    }
  }
}

// 分页参数处理
export function parsePaginationParams(url: URL) {
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const size = Math.min(100, Math.max(1, parseInt(url.searchParams.get('size') || '20')))
  const skip = (page - 1) * size
  
  return { page, size, skip }
}

// 分页响应数据格式
export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    size: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  size: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / size)
  
  return {
    items,
    pagination: {
      page,
      size,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}