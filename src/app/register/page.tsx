'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Input,
  Link,
  Flex,
  Field
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { OverlayLoading } from '@/components/OverlayLoading'
import { LoadingButton } from '@/components/LoadingSystem'
export default function RegisterPage() {
  const router = useRouter()
  const { register, user, loading: authLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (user) {
      router.push('/list')
    }
  }, [user, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空'
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少3个字符'
    } else if (formData.username.length > 20) {
      newErrors.username = '用户名不能超过20个字符'
    }
    
    if (!formData.password) {
      newErrors.password = '密码不能为空'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6个字符'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')
    
    try {
      const result = await register(formData.username, formData.password)
      
      if (result.success) {
        setSuccessMessage('注册成功！请登录您的账户')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setErrorMessage(result.error || '注册失败')
      }
    } catch (error) {
      setErrorMessage('注册失败，请重试')
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
    <>
      <OverlayLoading 
        isVisible={isLoading || authLoading} 
        message={isLoading ? "正在注册..." : "验证身份中..."} 
      />
      <Box 
        minH="100vh" 
        py={20} 
        px={4} 
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

      <Container maxW="md" position="relative" zIndex={10}>
        <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200" p={8} shadow="lg">
          <VStack gap={6}>
            <VStack textAlign="center" gap={2}>
              <Heading size="xl" color="gray.900">
                创建账户
              </Heading>
              <Text color="gray.600">
                加入我们，开始您的销售训练之旅
              </Text>
            </VStack>

            {errorMessage && (
              <Box bg="red.50" borderColor="red.200" borderWidth="1px" borderRadius="md" p={3} w="full">
                <Text color="red.600" fontSize="sm">
                  {errorMessage}
                </Text>
              </Box>
            )}

            {successMessage && (
              <Box bg="green.50" borderColor="green.200" borderWidth="1px" borderRadius="md" p={3} w="full">
                <Text color="green.600" fontSize="sm">
                  {successMessage}
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
                    placeholder="请输入用户名（3-20个字符）"
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
                    placeholder="请输入密码（至少6个字符）"
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

                <Field.Root invalid={!!errors.confirmPassword}>
                  <Field.Label color="gray.700">确认密码</Field.Label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    placeholder="请再次输入密码"
                    size="lg"
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'blue.400' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                  />
                  {errors.confirmPassword && (
                    <Field.ErrorText>{errors.confirmPassword}</Field.ErrorText>
                  )}
                </Field.Root>

                <LoadingButton
                  type="submit"
                  size="lg"
                  colorScheme="blue"
                  w="full"
                  isLoading={isLoading}
                  loadingText="注册中..."
                  py={6}
                  fontSize="lg"
                  disabled={!!successMessage}
                >
                  {successMessage ? '注册成功' : '创建账户'}
                </LoadingButton>
              </VStack>
            </Box>

            <VStack gap={4} w="full">
              <Text color="gray.600" textAlign="center">
                已有账户？{' '}
                <Link asChild color="blue.600" fontWeight="medium">
                  <NextLink href="/login">立即登录</NextLink>
                </Link>
              </Text>
              
              <Link asChild color="blue.600" fontWeight="medium">
                <NextLink href="/">返回首页</NextLink>
              </Link>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Box>
    </>
  )
}