'use client'

import { ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const navigationItems = [
    // { href: '/admin/dashboard', label: '数据总览' },
    { href: '/admin/dataset', label: '知识导入' },
    { href: '/admin/cases', label: '案例管理' },
  ]

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Fixed Sidebar */}
      <Box
        position="fixed"
        left={0}
        top={0}
        bottom={0}
        w="250px"
        bg="white"
        borderRightWidth="1px"
        borderColor="gray.200"
        zIndex={10}
        overflowY="auto"
      >
        <Flex direction="column" h="full" p={4}>
          {/* Logo/Brand */}
          <Box py={4} px={2}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              Admin
            </Text>
          </Box>

          <Separator />

          {/* Navigation */}
          <VStack align="stretch" gap={2} flex={1}>
            {navigationItems.map((item) => {
              const isActive = isActiveRoute(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <Box
                    as="button"
                    w="full"
                    px={3}
                    py={3}
                    borderRadius="md"
                    textAlign="left"
                    transition="all 0.2s"
                    cursor="pointer"
                    bg={isActive ? 'blue.50' : 'transparent'}
                    color={isActive ? 'blue.600' : 'gray.700'}
                    fontWeight={isActive ? 'semibold' : 'medium'}
                    borderLeft={isActive ? '3px solid' : '3px solid transparent'}
                    borderColor={isActive ? 'blue.500' : 'transparent'}
                    _hover={{ 
                      bg: isActive ? 'blue.100' : 'blue.50', 
                      color: 'blue.600' 
                    }}
                    _focus={{ 
                      bg: isActive ? 'blue.100' : 'blue.50', 
                      color: 'blue.600' 
                    }}
                  >
                    <HStack>
                      <Text>{item.label}</Text>
                    </HStack>
                  </Box>
                </Link>
              )
            })}
          </VStack>

          <Separator />

          {/* User Actions */}
          <VStack align="stretch" gap={2}>
            <Button
              variant="ghost"
              colorScheme="red"
              w="full"
              justifyContent="flex-start"
              onClick={handleLogout}
            >
              <HStack>
                <Text>退出登录</Text>
              </HStack>
            </Button>
          </VStack>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box ml="250px" minH="100vh">
        <Box h="full" overflowY="auto" p={6}>
          <Container maxW="full" p={0}>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  )
}