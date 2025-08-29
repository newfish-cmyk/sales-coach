'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Box,
  Icon
} from '@chakra-ui/react'
import { FiHome } from 'react-icons/fi'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <Container maxW="container.md" py={20}>
      <VStack gap={8} align="center" textAlign="center">
        <Box>
          <Heading size="3xl" mb={4} color="gray.800">
            404
          </Heading>
          <Heading size="lg" mb={4} color="gray.600">
            页面未找到
          </Heading>
          <Text fontSize="lg" color="gray.500">
            3秒后自动跳转到首页...
          </Text>
        </Box>
        
        <Button 
          colorScheme="blue" 
          size="lg"
          onClick={() => router.push('/')}
        >
          <Icon as={FiHome} />立即返回首页
        </Button>
      </VStack>
    </Container>
  )
}