import { Box, Text, VStack } from '@chakra-ui/react'

interface LoadingFallbackProps {
  height?: string
  message?: string
}

export function LoadingFallback({ 
  height = "200px", 
  message = "加载中..." 
}: LoadingFallbackProps) {
  return (
    <Box 
      h={height} 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      bg="gray.50"
      borderRadius="lg"
    >
      <VStack gap={2}>
        <Box
          w="40px"
          h="40px"
          border="3px solid"
          borderColor="blue.200"
          borderTopColor="blue.500"
          borderRadius="50%"
          animation="spin 1s linear infinite"
          css={{
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }}
        />
        <Text fontSize="sm" color="gray.600">{message}</Text>
      </VStack>
    </Box>
  )
}