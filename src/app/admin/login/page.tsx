'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Box,
  Input,
  Link,
  Flex,
  Field
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

export default function AdminLoginPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (user && user.role === 'admin') {
      router.push('/admin/dataset')
    }
  }, [user, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空'
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少3个字符'
    }
    
    if (!formData.password) {
      newErrors.password = '密码不能为空'
    } else if (formData.password.length < 4) {
      newErrors.password = '密码至少4个字符'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrorMessage('')
    
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        router.push('/admin/dataset')
        window.location.reload()
      } else {
        setErrorMessage(data.error || '登录失败')
      }
    } catch (error) {
      setErrorMessage('登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  if (authLoading) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Text>加载中...</Text>
      </Flex>
    )
  }

  return (
    <Box 
      minH="100vh" 
      py={20} 
      px={4} 
      bg="blue.50" 
      position="relative" 
      overflow="hidden"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        inset="0"
        opacity="0.05"
        bgImage="/api/placeholder/100/100"
        bgRepeat="repeat"
        bgSize="50px 50px"
      />
      
      {/* Floating Elements */}
      <MotionBox
        position="absolute"
        top="20"
        left="20"
        w="32"
        h="32"
        bg="blue.200"
        borderRadius="full"
        opacity="0.2"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <MotionBox
        position="absolute"
        bottom="20"
        right="20"
        w="24"
        h="24"
        bg="blue.300"
        borderRadius="full"
        opacity="0.2"
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <MotionBox
        position="absolute"
        top="40"
        right="32"
        w="16"
        h="16"
        bg="blue.400"
        borderRadius="full"
        opacity="0.15"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <Container maxW="md" position="relative" zIndex={10}>
        <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200" p={8} shadow="lg">
          <VStack gap={6}>
            <VStack textAlign="center" gap={2}>
              <Heading size="xl" color="gray.900">
                管理员登录
              </Heading>
              <Text color="gray.600">
                仅限管理员访问
              </Text>
            </VStack>

            {errorMessage && (
              <Box bg="red.50" borderColor="red.200" borderWidth="1px" borderRadius="md" p={3} w="full">
                <Text color="red.600" fontSize="sm">
                  {errorMessage}
                </Text>
              </Box>
            )}

            <Box as="form" onSubmit={handleSubmit} w="full">
              <VStack gap={4}>
                <Field.Root invalid={!!errors.username}>
                  <Field.Label color="gray.700">用户名</Field.Label>
                  <Input
                    value={formData.username}
                    onChange={handleChange('username')}
                    placeholder="请输入管理员用户名"
                    size="lg"
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'blue.400' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                  />
                  {errors.username && (
                    <Field.ErrorText>{errors.username}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.password}>
                  <Field.Label color="gray.700">密码</Field.Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={handleChange('password')}
                    placeholder="请输入密码"
                    size="lg"
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'blue.400' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                  />
                  {errors.password && (
                    <Field.ErrorText>{errors.password}</Field.ErrorText>
                  )}
                </Field.Root>

                <Button
                  type="submit"
                  size="lg"
                  colorScheme="blue"
                  w="full"
                  loading={isLoading}
                  py={6}
                  fontSize="lg"
                >
                  登录
                </Button>
              </VStack>
            </Box>

            <VStack gap={4} w="full">
              <Link asChild color="blue.600" fontWeight="medium">
                <NextLink href="/">返回首页</NextLink>
              </Link>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}