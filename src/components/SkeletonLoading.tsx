'use client'

import { Box, VStack, HStack, Stack } from '@chakra-ui/react'

// 骨架屏动画样式
const skeletonAnimation = `
  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  }
`

const skeletonStyle = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200px 100%',
  backgroundRepeat: 'no-repeat',
  animation: 'shimmer 1.5s infinite',
}

// 基础骨架块
export function SkeletonBox({ width = "100%", height = "20px", borderRadius = "4px" }) {
  return (
    <>
      <style>{skeletonAnimation}</style>
      <Box
        width={width}
        height={height}
        borderRadius={borderRadius}
        css={skeletonStyle}
      />
    </>
  )
}

// 案例卡片骨架
export function CaseCardSkeleton() {
  return (
    <Box
      w="full"
      maxW="xl"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
      p={6}
      bg="white"
    >
      <VStack align="stretch" gap={4}>
        {/* 头部 - 头像和标题 */}
        <HStack gap={3}>
          <SkeletonBox width="48px" height="48px" borderRadius="50%" />
          <VStack align="start" gap={2} flex={1}>
            <SkeletonBox width="120px" height="16px" />
            <SkeletonBox width="80px" height="12px" />
          </VStack>
        </HStack>
        
        {/* 内容描述 */}
        <VStack align="stretch" gap={2}>
          <SkeletonBox width="100%" height="12px" />
          <SkeletonBox width="80%" height="12px" />
          <SkeletonBox width="60%" height="12px" />
        </VStack>
        
        {/* 底部星级 */}
        <HStack justify="space-between">
          <SkeletonBox width="60px" height="14px" />
          <HStack gap={1}>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBox key={i} width="16px" height="16px" borderRadius="2px" />
            ))}
          </HStack>
        </HStack>
      </VStack>
    </Box>
  )
}

// 统计概览骨架
export function ProgressOverviewSkeleton() {
  return (
    <Box 
      bg="white" 
      borderRadius="xl" 
      p={6} 
      borderWidth="1px" 
      borderColor="gray.200" 
      shadow="lg"
      w="full"
    >
      <Stack direction={{ base: "column", md: "row" }} gap={6}>
        {Array.from({ length: 3 }).map((_, i) => (
          <VStack key={i} textAlign="center" flex={1}>
            <HStack justify="center" mb={2}>
              <SkeletonBox width="24px" height="24px" borderRadius="4px" />
              <SkeletonBox width="40px" height="24px" />
            </HStack>
            <SkeletonBox width="60px" height="12px" />
          </VStack>
        ))}
      </Stack>
    </Box>
  )
}

// 列表页骨架
export function ListPageSkeleton() {
  return (
    <Box bg="white" minH="100vh">
      {/* Header skeleton */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
        <Box maxW="container.xl" mx="auto" px={4}>
          <HStack justify="space-between">
            <SkeletonBox width="150px" height="24px" />
            <SkeletonBox width="40px" height="40px" borderRadius="50%" />
          </HStack>
        </Box>
      </Box>
      
      <Box maxW="container.xl" mx="auto" py={8} px={4}>
        {/* Progress overview skeleton */}
        <VStack textAlign="center" mb={8}>
          <ProgressOverviewSkeleton />
        </VStack>
        
        {/* Cases skeleton */}
        <VStack gap={8}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} position="relative" w="full">
              <Box display="flex" justifyContent="center">
                <CaseCardSkeleton />
              </Box>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  )
}