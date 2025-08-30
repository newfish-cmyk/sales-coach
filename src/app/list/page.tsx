'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Box,
  Flex,
  Spinner,
  SimpleGrid,
  Icon,
  Button,
  Separator,
} from '@chakra-ui/react'
import { Popover } from '@chakra-ui/react'
import { 
  FiAward, 
  FiStar, 
  FiLock, 
  FiCheckCircle,
  FiArrowDown,
  FiUser,
  FiLogOut
} from 'react-icons/fi'
import { getUserProgress } from '@/lib/data'
import { CaseWithProgress, UserProgressData } from '@/types'
import { useAuth } from '@/hooks/useAuth'

export default function ListPage() {
  const [progressData, setProgressData] = useState<UserProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user, logout, loading: authLoading } = useAuth()

  useEffect(() => {
    // 等待认证状态确定
    if (authLoading) return

    // 如果没有用户，跳转到登录页
    if (!user) {
      router.push('/login')
      return
    }

    // 如果有用户，加载进度数据
    const loadProgress = async () => {
      try {
        const data = await getUserProgress()
        setProgressData(data)
      } catch (error) {
        console.error('Failed to load progress:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [user, authLoading, router])

  const handleItemClick = (caseId: string, isLocked: boolean) => {
    if (!isLocked) {
      router.push(`/detail/${caseId}`)
    }
  }

  if (!progressData) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <VStack gap={4} justify="center" minH="50vh">
            <Spinner size="xl" />
            <Text>加载中...</Text>
          </VStack>
        </Container>
      </Box>
    )
  }

  const { cases, summary } = progressData

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <VStack gap={4} justify="center" minH="50vh">
            <Spinner size="xl" />
            <Text>加载中...</Text>
          </VStack>
        </Container>
      </Box>
    )
  }


  const StarRating = ({ stars, maxStars }: { stars: number; maxStars: number }) => {
    return (
      <HStack gap={1}>
        {Array.from({ length: maxStars }, (_, index) => (
          <Icon
            key={index}
            as={FiStar}
            w={4}
            h={4}
            color={index < stars ? 'yellow.400' : 'gray.300'}
            fill={index < stars ? 'yellow.400' : 'none'}
          />
        ))}
      </HStack>
    )
  }

  return (
    <Box bg="white">
      {/* Header Bar */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
        <Container maxW="container.xl">
          <HStack justify="space-between" align="center">
            <Heading 
              size="lg" 
              color="gray.900"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ color: "blue.600", transform: "scale(1.05)" }}
              onClick={() => {
                router.push('/')
              }}
            >
              销售对练系统
            </Heading>
            <Popover.Root>
              <Popover.Trigger asChild>
                <Button
                  bg="blue.600"
                  borderRadius="full"
                  w={10}
                  h={10}
                  minW="auto"
                  _hover={{ bg: "blue.700" }}
                  transition="background-color 0.2s"
                >
                  <Icon as={FiUser} w={5} h={5} color="white" />
                </Button>
              </Popover.Trigger>
              <Popover.Positioner>
                <Popover.Content w="200px">
                  <Popover.Arrow>
                    <Popover.ArrowTip />
                  </Popover.Arrow>
                  <Popover.Body>
                    <VStack gap={3} align="stretch">
                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={1}>
                          当前用户
                        </Text>
                        <Text fontWeight="semibold" color="gray.900">
                          {user?.username || '用户'}
                        </Text>
                      </Box>
                      <Separator />
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        onClick={async () => {
                          // 立即跳转，避免状态更新导致的认证检查
                          router.push('/')
                          await logout()
                        }}
                      >
                        <Icon as={FiLogOut} mr={2} />登出
                      </Button>
                    </VStack>
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Popover.Root>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        {/* Header Section */}
        <VStack textAlign="center" mb={8} gap={4}>
          {/* <Flex align="center" justify="center" mb={4}>
            <Icon as={FiMapPin} w={8} h={8} color="blue.600" mr={3} />
            <Heading size="3xl" color="blue.900" fontWeight="bold">
              销售对练路线图
            </Heading>
          </Flex> */}

          {/* Progress Overview */}
          <Box 
            bg="white" 
            borderRadius="xl" 
            p={6} 
            mb={8} 
            borderWidth="1px" 
            borderColor="blue.200" 
            shadow="lg"
            w="full"
          >
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              <VStack textAlign="center">
                <Flex align="center" justify="center" mb={2}>
                  <Icon as={FiAward} w={6} h={6} color="blue.600" mr={2} />
                  <Text fontSize="2xl" fontWeight="bold" color="blue.900">
                    {summary.completedCount}
                  </Text>
                  <Text color="blue.600" ml={1}>
                    / {summary.totalCases}
                  </Text>
                </Flex>
                <Text fontSize="sm" color="blue.700">完成关卡</Text>
              </VStack>
              <VStack textAlign="center">
                <Flex align="center" justify="center" mb={2}>
                  <Icon as={FiStar} w={6} h={6} color="yellow.400" fill="yellow.400" mr={2} />
                  <Text fontSize="2xl" fontWeight="bold" color="blue.900">
                    {summary.totalStars}
                  </Text>
                  <Text color="blue.600" ml={1}>
                    / {summary.maxTotalStars}
                  </Text>
                </Flex>
                <Text fontSize="sm" color="blue.700">获得星星</Text>
              </VStack>
              <VStack textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="blue.900" mb={2}>
                  {summary.completionPercentage}%
                </Text>
                <Text fontSize="sm" color="blue.700">完成度</Text>
              </VStack>
            </SimpleGrid>
          </Box>
        </VStack>

        {/* Roadmap */}
        <Box position="relative">
          {/* Path Line */}
          <Box
            position="absolute"
            left="50%"
            top="0"
            bottom="0"
            w="1px"
            bg="blue.400"
            transform="translateX(-50%)"
            display={{ base: 'none', lg: 'block' }}
          />

          <VStack gap={8}>
            {cases.map((case_, index) => (
              <Box key={case_.caseId} position="relative" w="full">
                {/* Path Node */}
                <Box
                  position="absolute"
                  left="50%"
                  top="8"
                  w="4"
                  h="4"
                  bg="white"
                  border="4px solid"
                  borderColor="blue.500"
                  borderRadius="full"
                  transform="translateX(-50%)"
                  zIndex={10}
                  display={{ base: 'none', lg: 'block' }}
                >
                  {case_.progress.isCompleted && (
                    <Box
                      position="absolute"
                      inset="0"
                      bg="blue.500"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={FiCheckCircle} w={3} h={3} color="white" />
                    </Box>
                  )}
                </Box>

                {/* Card Container with Alternating Layout */}
                <Box
                  display="flex"
                  justifyContent="center"
                  {...(index % 2 === 0
                    ? {
                        lg: {
                          justifyContent: 'flex-start',
                          pr: 8
                        }
                      }
                    : {
                        lg: {
                          justifyContent: 'flex-end',
                          pl: 8
                        }
                      })}
                >
                  <Box
                    w="full"
                    maxW="xl"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={case_.progress.isCompleted ? "blue.400" : "blue.200"}
                    shadow="lg"
                    cursor={case_.isLocked ? "not-allowed" : "pointer"}
                    opacity={case_.isLocked ? 0.6 : 1}
                    transition="all 0.3s"
                    _hover={!case_.isLocked ? {
                      shadow: "xl",
                      transform: "scale(1.05) translateY(-4px)"
                    } : {}}
                    onClick={() => handleItemClick(case_.caseId, case_.isLocked)}
                    bg={case_.progress.isCompleted ? "blue.50" : "white"}
                    {...(case_.progress.isCompleted && {
                      ring: 2,
                      ringColor: "blue.400"
                    })}
                  >
                    {/* Card Header */}
                    <Box p={6} pb={4}>
                      <Flex justify="space-between" align="start">
                        <Flex align="center" gap={3}>
                          <Box position="relative">
                            <Box
                              w={12}
                              h={12}
                              borderRadius="full"
                              bg="blue.100"
                              border="2px solid"
                              borderColor="blue.200"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              overflow="hidden"
                            >
                              {case_.avatar ? (
                                <img
                                  src={case_.avatar}
                                  alt={case_.customerName}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <Text color="blue.700" fontWeight="bold" fontSize="lg">
                                  {case_.customerName.charAt(0)}
                                </Text>
                              )}
                            </Box>
                            {case_.progress.isCompleted && (
                              <Box
                                position="absolute"
                                top="-1"
                                right="-1"
                                w="5"
                                h="5"
                                bg="blue.600"
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                border="2px solid white"
                              >
                                <Icon as={FiCheckCircle} w={3} h={3} color="white" />
                              </Box>
                            )}
                            {case_.isLocked && (
                              <Box
                                position="absolute"
                                top="-1"
                                right="-1"
                                w="5"
                                h="5"
                                bg="blue.400"
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                border="2px solid white"
                              >
                                <Icon as={FiLock} w={3} h={3} color="white" />
                              </Box>
                            )}
                          </Box>
                          <Box>
                            <Heading size="md" color="blue.900" mb={1}>
                              {case_.customerName}
                            </Heading>
                            <Text fontSize="sm" color="blue.600">
                              {case_.metaData.decision_level}
                            </Text>
                          </Box>
                        </Flex>
                      </Flex>
                    </Box>

                    {/* Card Content */}
                    <Box px={6} pb={6}>
                      <Text fontSize="sm" color="blue.700" mb={4} lineHeight="1.5">
                        {case_.intro}
                      </Text>

                      {/* Score Section */}
                      <VStack gap={3} align="stretch">
                        <Flex justify="space-between" align="center">
                          <Text fontSize="sm" fontWeight="medium" color="blue.800">
                            评级
                          </Text>
                          <Flex align="center" gap={2}>
                            <StarRating stars={case_.progress.bestStars} maxStars={5} />
                            <Text fontSize="sm" color="blue.600">
                              {case_.progress.bestStars}/5
                            </Text>
                          </Flex>
                        </Flex>

                        {case_.progress.isCompleted && (
                          <Flex justify="space-between" align="center">
                            <Flex align="center" color="blue.600" fontSize="sm" fontWeight="medium">
                              <Icon as={FiCheckCircle} w={4} h={4} mr={1} />
                              已完成
                            </Flex>
                            {case_.progress.totalAttempts > 0 && (
                              <Text fontSize="xs" color="blue.500">
                                尝试次数: {case_.progress.totalAttempts}
                              </Text>
                            )}
                          </Flex>
                        )}

                        {case_.isLocked && (
                          <Flex align="center" color="blue.400" fontSize="sm">
                            <Icon as={FiLock} w={4} h={4} mr={1} />
                            需要完成前置关卡
                          </Flex>
                        )}
                      </VStack>
                    </Box>
                  </Box>
                </Box>

                {/* Arrow for mobile */}
                {index < cases.length - 1 && (
                  <Flex justify="center" mt={4} display={{ base: 'flex', lg: 'none' }}>
                    <Icon as={FiArrowDown} w={6} h={6} color="blue.400" />
                  </Flex>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}