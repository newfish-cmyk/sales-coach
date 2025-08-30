'use client'

import { Box, VStack, Text } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

interface OverlayLoadingProps {
  isVisible: boolean
  message?: string
  showSpinner?: boolean
  blur?: boolean
}

export function OverlayLoading({ 
  isVisible, 
  message = "加载中...", 
  showSpinner = true,
  blur = true 
}: OverlayLoadingProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: blur ? 'blur(2px)' : 'none',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Box
              bg="white"
              borderRadius="xl"
              p={6}
              shadow="2xl"
              border="1px solid"
              borderColor="gray.100"
              minW="200px"
            >
              <VStack gap={4}>
                {showSpinner && (
                  <Box
                    w="40px"
                    h="40px"
                    border="3px solid"
                    borderColor="blue.100"
                    borderTopColor="blue.500"
                    borderRadius="50%"
                    animation="spin 0.8s linear infinite"
                    css={{
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }}
                  />
                )}
                <Text 
                  fontSize="sm" 
                  color="gray.700" 
                  fontWeight="medium"
                  textAlign="center"
                >
                  {message}
                </Text>
              </VStack>
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 简化版本 - 只有spinner不遮挡内容
export function InlineSpinner({ 
  isVisible, 
  size = "sm" 
}: { 
  isVisible: boolean
  size?: "sm" | "md" | "lg" 
}) {
  if (!isVisible) return null

  const sizeMap = {
    sm: "20px",
    md: "30px", 
    lg: "40px"
  }

  return (
    <Box
      w={sizeMap[size]}
      h={sizeMap[size]}
      border="2px solid"
      borderColor="blue.100"
      borderTopColor="blue.500"
      borderRadius="50%"
      animation="spin 0.8s linear infinite"
      css={{
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }}
    />
  )
}