'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  Badge,
  Table,
} from '@chakra-ui/react'
import { OverlayLoading } from '@/components/OverlayLoading'
import { 
  AtSignIcon, 
  StarIcon, 
  SettingsIcon, 
  InfoIcon 
} from '@chakra-ui/icons'

interface Stats {
  userCount: number
  caseCount: number
  adminCount: number
  totalUsers: number
}

interface RecentUser {
  id: string
  username: string
  createdAt: string
}

interface DashboardData {
  stats: Stats
  recentUsers: RecentUser[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      const data = await response.json()
      setData(data)
    } catch (error) {
      setError('加载数据失败')
      console.error('Dashboard data error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <>
        <OverlayLoading isVisible={true} />
        <Box minH="100vh" bg="gray.50" />
      </>
    )
  }

  if (error || !data) {
    return (
      <VStack align="center" justify="center" minH="400px">
        <Text color="red.500">{error || '数据加载失败'}</Text>
      </VStack>
    )
  }

  const statCards = [
    {
      title: '普通用户',
      value: data.stats.userCount,
      icon: AtSignIcon,
      color: 'blue'
    },
    {
      title: '训练案例',
      value: data.stats.caseCount,
      icon: StarIcon,
      color: 'green'
    },
    {
      title: '管理员',
      value: data.stats.adminCount,
      icon: SettingsIcon,
      color: 'purple'
    },
    {
      title: '总用户数',
      value: data.stats.totalUsers,
      icon: InfoIcon,
      color: 'orange'
    }
  ]

  return (
    <VStack align="stretch" gap={6}>
      <Box>
        <Heading size="lg" mb={2}>
          系统概览
        </Heading>
        <Text color="gray.600">
          销售训练系统管理面板
        </Text>
      </Box>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
        {statCards.map((card) => (
          <Card.Root key={card.title} p={6}>
            <Card.Body>
              <HStack justify="space-between">
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    {card.title}
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="gray.900">
                    {card.value}
                  </Text>
                </VStack>
                <Box fontSize="2xl" opacity={0.6}>
                  <card.icon boxSize={6} />
                </Box>
              </HStack>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>

      {/* Recent Users */}
      <Card.Root>
        <Card.Header>
          <HStack justify="space-between">
            <Heading size="md">最近注册用户</Heading>
            <Badge colorScheme="blue" variant="subtle">
              最近 5 个
            </Badge>
          </HStack>
        </Card.Header>
        <Card.Body>
          {data.recentUsers.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={4}>
              暂无用户数据
            </Text>
          ) : (
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>用户名</Table.ColumnHeader>
                  <Table.ColumnHeader>注册时间</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.recentUsers.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>
                      <Text fontWeight="medium">{user.username}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text color="gray.600" fontSize="sm">
                        {formatDate(user.createdAt)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </Card.Body>
      </Card.Root>

      {/* System Status */}
      <Card.Root>
        <Card.Header>
          <Heading size="md">系统状态</Heading>
        </Card.Header>
        <Card.Body>
          <VStack align="stretch" gap={3}>
            <HStack justify="space-between">
              <Text>数据库连接</Text>
              <Badge colorScheme="green" variant="solid">正常</Badge>
            </HStack>
            <HStack justify="space-between">
              <Text>API服务</Text>
              <Badge colorScheme="green" variant="solid">运行中</Badge>
            </HStack>
            <HStack justify="space-between">
              <Text>认证系统</Text>
              <Badge colorScheme="green" variant="solid">正常</Badge>
            </HStack>
          </VStack>
        </Card.Body>
      </Card.Root>
    </VStack>
  )
}