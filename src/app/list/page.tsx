'use client'

import { useEffect, lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  VStack,
  Text,
  Box,
  Icon,
  Flex,
} from '@chakra-ui/react'
import { FiArrowDown, FiCheckCircle } from 'react-icons/fi'
import { useRequest } from 'ahooks'
// Remove unused import since we use axios directly now
import { useAuth } from '@/contexts/AuthContext'
import { UserHeader } from '@/components/list/UserHeader'
import { OverlayLoading } from '@/components/OverlayLoading'
import { ProgressSummary } from '@/types'

// 懒加载重型组件
const ProgressOverview = lazy(() => import('@/components/list/ProgressOverview').then(module => ({ default: module.ProgressOverview })))
const CaseCard = lazy(() => import('@/components/list/CaseCard').then(module => ({ default: module.CaseCard })))

export default function ListPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  // 使用ahooks获取进度数据，更稳定
  const { data: progressData, loading, error } = useRequest(
    async () => {
      const response = await fetch('/api/progress', {
        credentials: 'include' // Include cookies for authentication
      })
      if (!response.ok) throw new Error('Failed to fetch progress')
      return response.json()
    },
    {
      ready: !!user && !authLoading, // 等待用户认证完成
      cacheKey: 'user-progress',
      staleTime: 10000, // 10秒缓存
      onError: (error) => {
        console.error('Failed to load progress:', error)
      }
    }
  )
  
  const shouldShowData = user && !authLoading && progressData

  useEffect(() => {
    // 如果认证已完成且没有用户，跳转到登录页
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const handleItemClick = (caseId: string, isLocked: boolean) => {
    if (!isLocked) {
      router.push(`/detail/${caseId}`)
    }
  }

  // 如果有错误且不是认证问题，显示错误
  if (error && user) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <VStack gap={4} justify="center" minH="50vh">
            <Text color="red.500">数据加载失败，请刷新重试</Text>
          </VStack>
        </Container>
      </Box>
    )
  }

  // 数据加载中，显示overlay
  if (!shouldShowData) {
    return (
      <>
        <OverlayLoading isVisible={loading} message="正在加载数据..." />
      </>
    )
  }

  const { cases = [], summary = {} as ProgressSummary } = progressData?.data || progressData || {}

  // 数据安全检查
  if (!Array.isArray(cases)) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <VStack gap={4} justify="center" minH="50vh">
            <Text color="red.500">数据格式错误，请刷新重试</Text>
          </VStack>
        </Container>
      </Box>
    )
  }

  return (
    <Box 
      minH="100vh" 
      bg="blue.50" 
      position="relative" 
      overflow="hidden"
    >
      {/* Simplified Background - Static for better performance */}
      <Box
        position="absolute"
        inset="0"
        opacity="0.02"
        bg="blue.100"
      />

      <UserHeader />
      
      <Container maxW="container.xl" py={8} position="relative" zIndex={10}>
        {/* Header Section */}
        <VStack textAlign="center" mb={8} gap={4}>
            <ProgressOverview summary={summary} />
        </VStack>

        {/* Roadmap */}
        <Box position="relative">
          {/* Path Line */}
          <Box
            position="absolute"
            left="50%"
            top="0"
            bottom="0"
            w="1px"
            bg="blue.400"
            transform="translateX(-50%)"
            display={{ base: 'none', lg: 'block' }}
          />

          <VStack gap={8}>
            {cases.map((case_, index) => (
                <Box position="relative" w="full" key={case_.caseId}>
                  {/* Path Node */}
                  <Box
                    position="absolute"
                    left="50%"
                    top="8"
                    w="4"
                    h="4"
                    bg="white"
                    border="4px solid"
                    borderColor="blue.500"
                    borderRadius="full"
                    transform="translateX(-50%)"
                    zIndex={10}
                    display={{ base: 'none', lg: 'block' }}
                  >
                    {case_.progress.isCompleted && (
                      <Box
                        position="absolute"
                        inset="0"
                        bg="blue.500"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FiCheckCircle} w={3} h={3} color="white" />
                      </Box>
                    )}
                  </Box>

                    <CaseCard case_={case_} index={index} onClick={handleItemClick} />

                  {/* Arrow for mobile */}
                  {index < cases.length - 1 && (
                    <Flex justify="center" mt={4} display={{ base: 'flex', lg: 'none' }}>
                      <Icon as={FiArrowDown} w={6} h={6} color="blue.400" />
                    </Flex>
                  )}
                </Box>
            ))}
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}