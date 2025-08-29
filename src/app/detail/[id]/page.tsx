'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Box,
  Badge,
  Flex,
  Grid,
  Spinner,
  Center,
  Icon
} from '@chakra-ui/react'
import { 
  FiArrowLeft, 
  FiUser, 
  FiMessageCircle, 
  FiClock, 
  FiTarget,
  FiStar
} from 'react-icons/fi'
import { getSalesItem } from '@/lib/data'
import { SalesItem } from '@/types'

interface Message {
  id: number
  sender: 'user' | 'customer'
  content: string
  timestamp: string
}

interface CustomerProfile {
  id: string
  name: string
  avatar: string
  role: string
  company: string
  personality: string[]
  painPoints: string[]
  budget: string
  decisionMaker: boolean
  background: string
}

export default function DetailPage() {
  const router = useRouter()
  const params = useParams()
  const [item, setItem] = useState<SalesItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [currentScore] = useState(4)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 扩展的客户档案数据
  const getCustomerProfile = (item: SalesItem): CustomerProfile => {
    const profiles: { [key: string]: Partial<CustomerProfile> } = {
      '1': {
        role: '采购经理',
        company: '科技创新有限公司',
        personality: ['友善', '开放', '注重关系'],
        painPoints: ['供应商选择', '成本优化', '质量保证'],
        budget: '10-30万',
        decisionMaker: true,
        background: '有3年采购经验，重视长期合作关系。喜欢详细了解产品特性，倾向于选择信誉良好的供应商。'
      },
      '2': {
        role: '质量总监',
        company: '精密制造有限公司',
        personality: ['挑剔', '注重细节', '完美主义'],
        painPoints: ['质量标准', '工艺改进', '成本控制'],
        budget: '20-50万',
        decisionMaker: true,
        background: '有8年质量管理经验，对产品质量要求极高。习惯深入了解技术细节，需要充分的质量证明和案例。'
      },
      '3': {
        role: '总经理',
        company: '商业投资集团',
        personality: ['谨慎', '理性', '战略思维'],
        painPoints: ['投资回报', '风险控制', '战略规划'],
        budget: '50-200万',
        decisionMaker: true,
        background: '15年商业经验，注重投资回报率和长期价值。决策谨慎，需要详细的商业价值分析和风险评估。'
      },
      '4': {
        role: '运营经理',
        company: '快速消费品公司',
        personality: ['急躁', '效率导向', '结果导向'],
        painPoints: ['效率提升', '时间管理', '成本压缩'],
        budget: '15-40万',
        decisionMaker: false,
        background: '在快节奏环境中工作，时间就是金钱。喜欢快速决策，重视实际效果和立即可见的价值。'
      },
      '5': {
        role: '技术总监',
        company: '高科技研发中心',
        personality: ['专业', '严谨', '技术导向'],
        painPoints: ['技术集成', '性能优化', '创新需求'],
        budget: '30-100万',
        decisionMaker: true,
        background: '博士学位，10年技术研发经验。重视技术指标和创新性，需要深入的技术交流和专业证明。'
      },
      '6': {
        role: '采购总监',
        company: '大型制造集团',
        personality: ['苛刻', '强势', '成本敏感'],
        painPoints: ['供应链优化', '成本降低', '风险管控'],
        budget: '100-500万',
        decisionMaker: true,
        background: '20年采购管理经验，以严格和苛刻著称。对价格和服务要求极高，习惯强势谈判。'
      }
    }

    const profile = profiles[item.id] || {}
    return {
      id: item.id,
      name: item.name,
      avatar: item.avatar || '',
      role: profile.role || '客户',
      company: profile.company || '某公司',
      personality: profile.personality || ['专业'],
      painPoints: profile.painPoints || ['业务需求'],
      budget: profile.budget || '待定',
      decisionMaker: profile.decisionMaker ?? true,
      background: profile.background || '专业的商业客户，注重产品价值和服务质量。'
    }
  }

  // 模拟对话数据
  const getConversationHistory = (): Message[] => {
    return [
      {
        id: 1,
        sender: 'customer',
        content: '你好，我想了解一下你们的产品和服务。',
        timestamp: '09:30'
      },
      {
        id: 2,
        sender: 'user',
        content: '您好！很高兴为您介绍我们的产品。请问您目前在业务方面遇到了什么挑战吗？',
        timestamp: '09:32'
      },
      {
        id: 3,
        sender: 'customer',
        content: '主要是想提升我们的运营效率，同时控制成本。听说你们有相关的解决方案？',
        timestamp: '09:35'
      },
      {
        id: 4,
        sender: 'user',
        content: '我完全理解您的关注点。我们的产品在效率提升和成本控制方面都有很好的表现。让我为您详细介绍一下...',
        timestamp: '09:37'
      }
    ]
  }

  const [messages] = useState<Message[]>(getConversationHistory())

  useEffect(() => {
    const loadItem = async () => {
      try {
        const data = await getSalesItem(params.id as string)
        setItem(data)
      } catch (error) {
        console.error('Failed to load item:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadItem()
    }
  }, [params.id])

  const StarRating = ({ score }: { score: number }) => {
    return (
      <HStack gap={1}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            as={FiStar}
            w={5}
            h={5}
            color={star <= score ? 'yellow.400' : 'gray.300'}
            fill={star <= score ? 'yellow.400' : 'none'}
          />
        ))}
        <Text ml={2} fontSize="sm" color="gray.600">
          {score}/5
        </Text>
      </HStack>
    )
  }

  if (!mounted || loading) {
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

  if (!item) {
    return (
      <Center h="100vh">
        <VStack gap={4}>
          <Text fontSize="lg" color="gray.600">
            未找到相关信息
          </Text>
          <Button onClick={() => router.push('/list')}>
            返回列表
          </Button>
        </VStack>
      </Center>
    )
  }

  const customer = getCustomerProfile(item)

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #EBF8FF 0%, #FFFFFF 100%)">
      {/* 顶部导航 */}
      <Box
        borderBottomWidth="1px"
        borderColor="blue.200"
        bg="whiteAlpha.800"
        backdropFilter="blur(10px)"
        position="sticky"
        top="0"
        zIndex={10}
      >
        <Container maxW="container.xl">
          <Flex align="center" justify="space-between" h={16}>
            <HStack gap={4}>
              <Button
                variant="ghost"
                size="sm"
                color="blue.600"
                _hover={{ color: 'blue.700', bg: 'blue.50' }}
                onClick={() => router.push('/list')}
              >
                <Icon as={FiArrowLeft} />返回路线图
              </Button>
              <Box h={6} w="1px" bg="blue.300" />
              <Heading size="md" color="blue.900">
                销售对练 - {customer.name}
              </Heading>
            </HStack>
            <HStack gap={4}>
              <Text fontSize="sm" color="blue.700">
                当前得分:
              </Text>
              <StarRating score={currentScore} />
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={8}>
          {/* 左侧 - 客户信息卡片 */}
          <Box>
            <Box
              borderWidth="1px"
              borderColor="blue.200"
              borderRadius="lg"
              bg="whiteAlpha.900"
              backdropFilter="blur(10px)"
              shadow="lg"
              p={6}
            >
              {/* 客户头像和基本信息 */}
              <VStack textAlign="center" mb={6}>
                <Box
                  w={24}
                  h={24}
                  borderRadius="full"
                  bg="blue.100"
                  border="4px solid"
                  borderColor="blue.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                  mb={4}
                >
                  {customer.avatar ? (
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Text color="blue.700" fontWeight="bold" fontSize="2xl">
                      {customer.name.charAt(0)}
                    </Text>
                  )}
                </Box>
                <Heading size="lg" color="blue.900">
                  {customer.name}
                </Heading>
                <Text color="blue.600" fontWeight="medium">
                  {customer.role}
                </Text>
                <Text fontSize="sm" color="blue.700">
                  {customer.company}
                </Text>
              </VStack>

              <VStack align="stretch" gap={6}>
                {/* 基本信息 */}
                <Box>
                  <Heading size="sm" color="blue.900" mb={3} display="flex" alignItems="center">
                    <Icon as={FiUser} w={4} h={4} mr={2} color="blue.600" />
                    基本信息
                  </Heading>
                  <VStack gap={2} fontSize="sm">
                    <Flex justify="space-between" w="full">
                      <Text color="blue.700">预算范围:</Text>
                      <Text fontWeight="medium" color="blue.900">
                        {customer.budget}
                      </Text>
                    </Flex>
                    <Flex justify="space-between" w="full">
                      <Text color="blue.700">决策权:</Text>
                      <Badge
                        colorScheme={customer.decisionMaker ? 'blue' : 'gray'}
                        variant="subtle"
                        fontSize="xs"
                      >
                        {customer.decisionMaker ? '决策者' : '影响者'}
                      </Badge>
                    </Flex>
                  </VStack>
                </Box>

                {/* 性格特点 */}
                <Box>
                  <Heading size="sm" color="blue.900" mb={3} display="flex" alignItems="center">
                    <Icon as={FiTarget} w={4} h={4} mr={2} color="blue.600" />
                    性格特点
                  </Heading>
                  <Flex flexWrap="wrap" gap={2}>
                    {customer.personality.map((trait, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        fontSize="xs"
                        borderColor="blue.300"
                        color="blue.700"
                        bg="blue.50"
                      >
                        {trait}
                      </Badge>
                    ))}
                  </Flex>
                </Box>

                {/* 痛点需求 */}
                <Box>
                  <Heading size="sm" color="blue.900" mb={3}>
                    关键痛点
                  </Heading>
                  <VStack align="start" gap={2}>
                    {customer.painPoints.map((point, index) => (
                      <Flex key={index} align="start" fontSize="sm" color="blue.700">
                        <Box
                          w="6px"
                          h="6px"
                          bg="blue.500"
                          borderRadius="full"
                          mt="6px"
                          mr={2}
                          flexShrink={0}
                        />
                        <Text>{point}</Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>

                {/* 背景介绍 */}
                <Box>
                  <Heading size="sm" color="blue.900" mb={3}>
                    背景介绍
                  </Heading>
                  <Text fontSize="sm" color="blue.700" lineHeight="relaxed">
                    {customer.background}
                  </Text>
                </Box>
              </VStack>
            </Box>
          </Box>

          {/* 右侧 - 对话记录 */}
          <Box>
            <Box
              borderWidth="1px"
              borderColor="blue.200"
              borderRadius="lg"
              bg="whiteAlpha.900"
              backdropFilter="blur(10px)"
              shadow="lg"
              h="600px"
              display="flex"
              flexDirection="column"
            >
              {/* 对话标题 */}
              <Box
                borderBottomWidth="1px"
                borderColor="blue.100"
                p={4}
                flexShrink={0}
              >
                <Heading size="md" display="flex" alignItems="center" color="blue.900">
                  <Icon as={FiMessageCircle} w={5} h={5} mr={2} color="blue.600" />
                  对话记录
                </Heading>
              </Box>

              {/* 对话内容 */}
              <Box flex={1} overflowY="auto" p={6}>
                <VStack gap={4} align="stretch">
                  {messages.map((message) => (
                    <Flex
                      key={message.id}
                      justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                    >
                      <Box
                        maxW="70%"
                        borderRadius="lg"
                        px={4}
                        py={3}
                        bg={
                          message.sender === 'user'
                            ? 'blue.600'
                            : 'blue.50'
                        }
                        color={
                          message.sender === 'user'
                            ? 'white'
                            : 'blue.900'
                        }
                        borderWidth={message.sender === 'customer' ? '1px' : '0'}
                        borderColor="blue.200"
                      >
                        <Text fontSize="sm" lineHeight="relaxed">
                          {message.content}
                        </Text>
                        <Flex
                          align="center"
                          mt={2}
                          fontSize="xs"
                          color={
                            message.sender === 'user'
                              ? 'blue.100'
                              : 'blue.600'
                          }
                        >
                          <Icon as={FiClock} w={3} h={3} mr={1} />
                          {message.timestamp}
                        </Flex>
                      </Box>
                    </Flex>
                  ))}
                </VStack>
              </Box>

              {/* 操作按钮 */}
              <Box
                borderTopWidth="1px"
                borderColor="blue.100"
                p={4}
                flexShrink={0}
              >
                <HStack gap={2}>
                  <Button
                    flex={1}
                    colorScheme="blue"
                    bg="blue.600"
                    _hover={{ bg: 'blue.700' }}
                  >
                    继续对话
                  </Button>
                  <Button
                    variant="outline"
                    borderColor="blue.300"
                    color="blue.600"
                    bg="white"
                    _hover={{ bg: 'blue.50' }}
                  >
                    重新开始
                  </Button>
                </HStack>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Container>
    </Box>
  )
}