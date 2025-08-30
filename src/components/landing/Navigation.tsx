'use client'

import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  HStack,
} from '@chakra-ui/react'
import { FiUser } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()

  const navItems = [
    { label: '功能特色', href: '#features' },
    { label: '产品演示', href: '#demo' },
    { label: '联系我们', href: '#contact' }
  ]

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg={'white'}
      borderBottom="1px"
      borderColor={'gray.200'}
      backdropFilter="blur(10px)"
      bgColor="whiteAlpha.900"
      zIndex={1000}
      _dark={{
        bgColor: 'blackAlpha.900'
      }}
    >
      <Container maxW="6xl" px={6}>
        <Flex align="center" justify="space-between" h={16}>
          {/* Logo */}
          <Heading
            size="lg"
            color="blue.600"
            cursor="pointer"
            onClick={() => router.push('/')}
            _hover={{ color: 'blue.700' }}
            transition="color 0.2s"
          >
            销售对练系统
          </Heading>

          {/* Desktop Navigation */}
          <HStack gap={8} display={{ base: 'none', md: 'flex' }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                color="gray.600"
                _hover={{ color: 'blue.600' }}
                onClick={() => {
                  if (item.href.startsWith('#')) {
                    const element = document.getElementById(item.href.slice(1))
                    element?.scrollIntoView({ behavior: 'smooth' })
                  } else {
                    router.push(item.href)
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </HStack>

          {/* Desktop CTA Buttons */}
          <HStack gap={4} display={{ base: 'none', md: 'flex' }}>
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={() => router.push('/login')}
            >
              登录
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => router.push('/register')}
            >
              <FiUser />免费注册
            </Button>
          </HStack>

        </Flex>
      </Container>

    </Box>
  )
}