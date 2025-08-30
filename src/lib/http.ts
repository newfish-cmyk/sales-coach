// 统一响应格式接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

// HTTP客户端类
class HttpClient {
  private baseURL: string
  private timeout: number

  constructor(baseURL: string = '/api', timeout: number = 10000) {
    this.baseURL = baseURL
    this.timeout = timeout
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const fullUrl = `${this.baseURL}${url}`
    
    // 默认配置
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(fullUrl, {
        ...config,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: ApiResponse<T> = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Request failed')
      }

      return data.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network request failed')
    }
  }

  // GET 请求
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    let fullUrl = url
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      const queryString = searchParams.toString()
      if (queryString) {
        fullUrl += `?${queryString}`
      }
    }

    return this.request<T>(fullUrl, {
      method: 'GET',
    })
  }

  // POST 请求
  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT 请求
  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PATCH 请求
  async patch<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE 请求
  async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, {
      method: 'DELETE',
    })
  }
}

// 创建默认实例
export const http = new HttpClient()

// 导出类以便创建自定义实例
export { HttpClient }