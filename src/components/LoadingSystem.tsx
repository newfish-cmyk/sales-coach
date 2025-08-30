'use client'

import { Box, Spinner, Button } from '@chakra-ui/react'

// 全屏遮罩loading - 用于页面级loading
interface OverlayLoadingProps {
  isVisible: boolean
}

export function OverlayLoading({ isVisible }: OverlayLoadingProps) {
  if (!isVisible) return null

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      backgroundColor="rgba(0, 0, 0, 0.4)"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner
        thickness="4px"
        speed="0.8s"
        emptyColor="rgba(255, 255, 255, 0.3)"
        color="white"
        size="xl"
        w="60px"
        h="60px"
      />
    </Box>
  )
}

// 内联加载器 - 用于局部内容loading
interface InlineLoadingProps {
  isVisible: boolean
  height?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function InlineLoading({ 
  isVisible, 
  height = "200px", 
  size = "lg" 
}: InlineLoadingProps) {
  if (!isVisible) return null

  return (
    <Box 
      h={height} 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      bg="gray.50"
      borderRadius="lg"
    >
      <Spinner
        thickness="3px"
        speed="0.8s"
        emptyColor="gray.200"
        color="blue.500"
        size={size}
      />
    </Box>
  )
}

// 按钮loading状态 - 包装原始按钮
interface LoadingButtonProps {
  isLoading: boolean
  loadingText?: string
  children: React.ReactNode
  [key: string]: unknown
}

export function LoadingButton({ 
  isLoading, 
  loadingText = "加载中...", 
  children, 
  ...props 
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={isLoading || props.disabled}
      _disabled={{ 
        bg: 'gray.300', 
        cursor: 'not-allowed',
        ...props._disabled 
      }}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" mr={2} />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}

// 页面级loading - 用于整个页面初始化
interface PageLoadingProps {
  isVisible: boolean
}

export function PageLoading({ isVisible }: PageLoadingProps) {
  if (!isVisible) return null

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <Spinner
        thickness="4px"
        speed="0.8s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Box>
  )
}