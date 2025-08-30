import useSWR from 'swr'

// 通用fetcher函数
export const fetcher = async (url: string) => {
  const response = await fetch(url)
  
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // 附加错误信息
    error.message = `${response.status}: ${response.statusText}`
    throw error
  }
  
  return response.json()
}

// SWR配置选项
export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true, 
  dedupingInterval: 5000, // 5秒内重复请求去重
  errorRetryCount: 3,
  errorRetryInterval: 1000,
}

// 用户进度数据hook
export function useUserProgress() {
  return useSWR('/api/progress', fetcher, {
    ...swrConfig,
    refreshInterval: 0, // 不自动刷新
  })
}

// 管理员统计数据hook
export function useAdminStats() {
  return useSWR('/api/admin/stats', fetcher, {
    ...swrConfig,
    refreshInterval: 30000, // 30秒自动刷新
  })
}

// 案例列表数据hook
export function useAdminCases() {
  return useSWR('/api/admin/cases', fetcher, {
    ...swrConfig,
    refreshInterval: 0,
  })
}

// 案例详情数据hook
export function useCaseDetail(caseId: string | null) {
  return useSWR(
    caseId ? `/api/case/${caseId}` : null,
    fetcher,
    {
      ...swrConfig,
      refreshInterval: 0,
    }
  )
}