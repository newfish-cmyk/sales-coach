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
  Icon,
  Textarea,
} from '@chakra-ui/react'
import { 
  FiArrowLeft, 
  FiUser, 
  FiMessageCircle, 
  FiClock, 
  FiTarget,
  FiStar,
  FiMic,
  FiMicOff,
  FiSend
} from 'react-icons/fi'
import { getCase } from '@/lib/data'
import { Case } from '@/types'

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
  const [item, setItem] = useState<Case | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  const [messages, setMessages] = useState<Message[]>([

  ])
  const [isRecording, setIsRecording] = useState(false)
  const [inputText, setInputText] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  // 对话处理函数
  const handleStartRecording = () => {
    setIsRecording(true)
    console.log("开始录音")
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    console.log("停止录音")
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      content: inputText,
      timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMessage])
    setInputText("")
    
  }

  // 扩展的客户档案数据
  const getCustomerProfile = (item: Case): CustomerProfile => {
    return {
      id: item._id,
      name: item.customerName,
      avatar: item.avatar || '',
      role: item.metaData.decision_level || '客户',
      company: '某公司',
      personality: item.metaData.personality || ['专业'],
      painPoints: item.metaData.points || ['业务需求'],
      budget: item.metaData.budget || '待定',
      decisionMaker: item.metaData.decision_level?.includes('决策') || item.metaData.decision_level?.includes('总监') || item.metaData.decision_level?.includes('经理') || false,
      background: item.metaData.background || '专业的商业客户，注重产品价值和服务质量。'
    }
  }


  useEffect(() => {
    const loadItem = async () => {
      try {
        const data = await getCase(params.id as string)
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
                <Icon as={FiArrowLeft} />返回
              </Button>
              <Box h={6} w="1px" bg="blue.300" />
              <Heading size="md" color="blue.900">
                销售对练 - {customer.name}
              </Heading>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={8} alignItems="start">
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

              <VStack align="stretch" gap={6} flex={1}>
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
                <Box flex={1}>
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
              minH="600px"
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

              {/* 输入区域 */}
              <Box
                borderTopWidth="1px"
                borderColor="blue.100"
                p={4}
                flexShrink={0}
              >
                <VStack gap={3}>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="输入您的回复或点击麦克风使用语音输入..."
                    minH="80px"
                    borderColor="blue.200"
                    _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #3182CE' }}
                    bg="white"
                  />
                  <HStack gap={2} w="full">
                    <Button
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                      variant="outline"
                      borderColor="blue.300"
                      color={isRecording ? "red.600" : "blue.600"}
                      bg={isRecording ? "red.50" : "white"}
                      _hover={{ bg: isRecording ? "red.100" : "blue.50" }}
                    >
                      <Icon as={isRecording ? FiMicOff : FiMic} w={4} h={4} mr={2} />
                      {isRecording ? "停止录音" : "语音输入"}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      colorScheme="blue"
                      bg="blue.600"
                      _hover={{ bg: 'blue.700' }}
                      _disabled={{ bg: 'gray.300', cursor: 'not-allowed' }}
                      flex={1}
                    >
                      <Icon as={FiSend} w={4} h={4} mr={2} />
                      发送
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Container>
    </Box>
  )
}