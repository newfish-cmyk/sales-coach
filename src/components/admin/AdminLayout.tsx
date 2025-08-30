'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  Separator
} from '@chakra-ui/react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const navigationItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/dataset', label: '数据集导入', icon: '📁' },
    { href: '/admin/cases', label: '案例管理', icon: '📝' },
  ]

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Sidebar */}
      <Box w="250px" bg="white" borderRightWidth="1px" borderColor="gray.200" p={4}>
        <VStack align="stretch" gap={4}>
          {/* Logo/Brand */}
          <Box py={4} px={2}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              管理后台
            </Text>
          </Box>

          <Separator />

          {/* Navigation */}
          <VStack align="stretch" gap={2}>
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Box
                  as="button"
                  w="full"
                  px={3}
                  py={3}
                  borderRadius="md"
                  textAlign="left"
                  transition="all 0.2s"
                  _hover={{ bg: 'blue.50', color: 'blue.600' }}
                  _focus={{ bg: 'blue.50', color: 'blue.600' }}
                >
                  <HStack>
                    <Text fontSize="lg">{item.icon}</Text>
                    <Text fontWeight="medium">{item.label}</Text>
                  </HStack>
                </Box>
              </Link>
            ))}
          </VStack>

          <Separator />

          {/* User Actions */}
          <VStack align="stretch" gap={2} mt="auto">
            <Link href="/list">
              <Button variant="ghost" w="full" justifyContent="flex-start">
                <HStack>
                  <Text>🏠</Text>
                  <Text>返回前台</Text>
                </HStack>
              </Button>
            </Link>
            <Button
              variant="ghost"
              colorScheme="red"
              w="full"
              justifyContent="flex-start"
              onClick={handleLogout}
            >
              <HStack>
                <Text>🚪</Text>
                <Text>退出登录</Text>
              </HStack>
            </Button>
          </VStack>
        </VStack>
      </Box>

      {/* Main Content */}
      <Flex flex={1} direction="column">
        {/* Header */}
        <Box bg="white" borderBottomWidth="1px" borderColor="gray.200" px={6} py={4}>
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
              销售训练管理系统
            </Text>
            <HStack gap={4}>
              <Text fontSize="sm" color="gray.600">
                管理员
              </Text>
            </HStack>
          </HStack>
        </Box>

        {/* Page Content */}
        <Box flex={1} p={6}>
          <Container maxW="full" p={0}>
            {children}
          </Container>
        </Box>
      </Flex>
    </Flex>
  )
}