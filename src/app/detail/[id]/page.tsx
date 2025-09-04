'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useRequest } from 'ahooks'
import Image from 'next/image'
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
  Center,
  Icon,
  Textarea,
  Spinner
} from '@chakra-ui/react'
import { PageLoading, LoadingButton } from '@/components/LoadingSystem'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { 
  FiArrowLeft, 
  FiUser, 
  FiMessageCircle, 
  FiClock, 
  FiTarget,
  FiMic,
  FiMicOff,
  FiSend
} from 'react-icons/fi'
// Remove unused imports since we use fetch directly now
import { Case, ChatMessage, ChatResult } from '@/types'


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
  
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [inputText, setInputText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [chatResult, setChatResult] = useState<ChatResult | null>(null)

  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return
      
      try {
        // 1. 先加载案例信息
        const caseResponse = await fetch(`/api/cases/${params.id}`, { 
          credentials: 'include' 
        })
        
        if (caseResponse.ok) {
          const caseResponse_data = await caseResponse.json()
          // apiHandler 包装了响应，实际数据在 data 字段中  
          const caseData = caseResponse_data.data || caseResponse_data
          setItem(caseData)
        }
        
        // 2. 检查是否有未完成的 attempt
        const attemptResponse = await fetch(`/api/cases/${params.id}/current-attempt`, { 
          credentials: 'include' 
        })
        
        if (attemptResponse.ok) {
          const attemptResponse_data = await attemptResponse.json()
          // apiHandler 包装了响应，实际数据在 data 字段中
          const attemptData = attemptResponse_data.data || attemptResponse_data
          if (attemptData.hasAttempt) {
            // 有未完成的对话，加载消息
            setMessages(attemptData.messages || [])
            setIsComplete(attemptData.isComplete || false)
            if (attemptData.isComplete && attemptData.result) {
              setChatResult(attemptData.result)
            }
          } else {
            // 没有未完成的对话，页面保持空白
            setMessages([])
            setIsComplete(false)
            setChatResult(null)
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const { run: handleSendMessage, loading: sendingMessage } = useRequest(
    async (messageContent: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          caseId: params.id,
          message: messageContent,
          conversationHistory: messages
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        throw new Error('Failed to send message')
      }
      
      const data = await response.json()
      return data
    },
    {
      manual: true,
      onSuccess: (response) => {
        // apiHandler 包装了响应，实际数据在 data 字段中
        const data = response.data || response
        // 直接使用 API 返回的对话历史，确保实时更新
        setMessages(data.conversationHistory || [])
        if (data.isComplete) {
          setIsComplete(true)
          setChatResult(data.result)
        }
      },
      onError: (error) => {
        console.error('Failed to send message:', error)
      }
    }
  )

  // 语音识别：将识别文本拼接到输入框末尾
  const { isSupported, isListening, start, stop } = useSpeechRecognition({
    lang: 'zh-CN',
    continuous: false,
    interimResults: true,
    onFinal: (text: string) => {
      if (!text) return
      setInputText((prev) => {
        if (!prev) return text
        const needsSpace = !/\s$/.test(prev)
        return `${prev}${needsSpace ? ' ' : ''}${text}`
      })
    }
  })

  useEffect(() => {
    setIsRecording(isListening)
  }, [isListening])

  // 对话处理函数（按钮触发开始/停止）
  const handleStartRecording = () => {
    if (!isSupported) {
      console.warn('当前浏览器不支持语音识别')
      return
    }
    start()
  }

  const handleStopRecording = () => {
    stop()
  }

  const onSendMessage = () => {
    if (!inputText.trim() || sendingMessage || isComplete) return
    
    const messageContent = inputText.trim()
    setInputText("")
    handleSendMessage(messageContent)
  }

  const handleRestart = async () => {
    try {
      // 放弃当前的 attempt
      await fetch(`/api/cases/${params.id}/abandon-attempt`, {
        method: 'POST',
        credentials: 'include'
      })
      
      // 重置页面状态
      setMessages([])
      setIsComplete(false)
      setChatResult(null)
      setInputText('')
    } catch (error) {
      console.error('Failed to abandon attempt:', error)
      // 即使失败也要重置界面状态
      setMessages([])
      setIsComplete(false)
      setChatResult(null)
      setInputText('')
    }
  }

  // 使用useMemo优化客户档案数据计算
  const customer = useMemo((): CustomerProfile | null => {
    // Handle API response wrapper
    const caseData = item?.data || item
    if (!caseData) return null
    
    return {
      id: caseData._id,
      name: caseData.customerName,
      avatar: caseData.avatar || '',
      role: caseData.metaData.decision_level || '客户',
      company: '某公司',
      personality: caseData.metaData.personality || ['专业'],
      painPoints: caseData.metaData.points || ['业务需求'],
      budget: caseData.metaData.budget || '待定',
      decisionMaker: caseData.metaData.decision_level?.includes('决策') || 
                    caseData.metaData.decision_level?.includes('总监') || 
                    caseData.metaData.decision_level?.includes('经理') || false,
      background: caseData.metaData.background || '专业的商业客户，注重产品价值和服务质量。'
    }
  }, [item])


  if (loading) {
    return <PageLoading isVisible={true} />
  }

  if (!item || !customer) {
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

  return (
    <Box 
      minH="100vh" 
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

      <Box position="relative" zIndex={10}>
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
                    <Image
                      src={customer.avatar}
                      alt={customer.name}
                      width={120}
                      height={120}
                      className="object-cover rounded-full"
                      priority // 详情页头像优先加载
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
                <HStack justify="space-between" align="center">
                  <Heading size="md" display="flex" alignItems="center" color="blue.900">
                    <Icon as={FiMessageCircle} w={5} h={5} mr={2} color="blue.600" />
                    对话记录
                  </Heading>
                  {messages && messages.length > 0 && !isComplete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      onClick={handleRestart}
                      _hover={{ bg: 'blue.50' }}
                    >
                      重新开始
                    </Button>
                  )}
                </HStack>
              </Box>

              {/* 对话内容 */}
              <Box flex={1} overflowY="auto" p={6}>
                <VStack gap={4} align="stretch">
                  
                  {(!messages || messages.length === 0) && !isComplete && (
                    <Box textAlign="center" py={8}>
                      <Text color="blue.600" fontSize="sm">
                        开始与 {customer?.name} 的销售对练吧！
                      </Text>
                    </Box>
                  )}
                  
                  {messages && messages.map((message, index) => (
                    <Flex
                      key={index}
                      justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
                    >
                      <Box
                        maxW="70%"
                        borderRadius="lg"
                        px={4}
                        py={3}
                        bg={
                          message.role === 'user'
                            ? 'blue.600'
                            : 'blue.50'
                        }
                        color={
                          message.role === 'user'
                            ? 'white'
                            : 'blue.900'
                        }
                        borderWidth={message.role === 'assistant' ? '1px' : '0'}
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
                            message.role === 'user'
                              ? 'blue.100'
                              : 'blue.600'
                          }
                        >
                          <Icon as={FiClock} w={3} h={3} mr={1} />
                          {new Date(message.timestamp).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                        </Flex>
                      </Box>
                    </Flex>
                  ))}
                  
                  {sendingMessage && (
                    <Flex justify="flex-start">
                      <Box
                        maxW="70%"
                        borderRadius="lg"
                        px={4}
                        py={3}
                        bg="blue.50"
                        color="blue.900"
                        borderWidth="1px"
                        borderColor="blue.200"
                      >
                        <Flex align="center" gap={2}>
                          <Spinner size="sm" color="blue.600" />
                          <Text fontSize="sm">正在回复...</Text>
                        </Flex>
                      </Box>
                    </Flex>
                  )}
                </VStack>
              </Box>

              {/* 输入区域或结果展示 */}
              <Box
                borderTopWidth="1px"
                borderColor="blue.100"
                p={4}
                flexShrink={0}
              >
                {isComplete && chatResult ? (
                  // 显示评分结果
                  <VStack gap={4} align="stretch">
                    <Box textAlign="center">
                      <Heading size="md" color="blue.900" mb={2}>
                        🎉 对练完成！
                      </Heading>
                      <HStack justify="center" gap={1} mb={2}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Text
                            key={star}
                            fontSize="2xl"
                            color={star <= chatResult.stars ? 'yellow.400' : 'gray.200'}
                          >
                            ⭐
                          </Text>
                        ))}
                      </HStack>
                      <Text fontSize="xl" fontWeight="bold" color="blue.700">
                        得分：{chatResult.score} 分
                      </Text>
                      <Text fontSize="sm" color="blue.600">
                        本关卡尝试次数：{chatResult.totalAttempts} | 最高分：{chatResult.bestScore}
                      </Text>
                    </Box>
                    
                    <Box
                      bg="blue.50"
                      borderRadius="md"
                      p={4}
                      borderWidth="1px"
                      borderColor="blue.200"
                    >
                      <Text fontSize="sm" color="blue.800" lineHeight="relaxed" whiteSpace="pre-line">
                        {chatResult.report}
                      </Text>
                    </Box>
                    
                    <HStack gap={2}>
                      <Button
                        onClick={handleRestart}
                        colorScheme="blue"
                        bg="blue.600"
                        _hover={{ bg: 'blue.700' }}
                        flex={1}
                      >
                        再次挑战
                      </Button>
                      <Button
                        onClick={() => router.push('/list')}
                        variant="outline"
                        borderColor="blue.300"
                        color="blue.600"
                        _hover={{ bg: 'blue.50' }}
                        flex={1}
                      >
                        返回列表
                      </Button>
                    </HStack>
                  </VStack>
                ) : (
                  // 正常输入区域
                  <VStack gap={3}>
                    <Textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          onSendMessage()
                        }
                      }}
                      placeholder="输入您的回复或点击麦克风使用语音输入..."
                      minH="80px"
                      borderColor="blue.200"
                      _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #3182CE' }}
                      bg="white"
                      disabled={sendingMessage || isComplete}
                    />
                    <HStack gap={2} w="full">
                      <Button
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        variant="outline"
                        borderColor="blue.300"
                        color={!isSupported ? 'gray.400' : isRecording ? 'red.600' : 'blue.600'}
                        bg={!isSupported ? 'gray.50' : isRecording ? 'red.50' : 'white'}
                        _hover={{ bg: isRecording ? "red.100" : "blue.50" }}
                        disabled={!isSupported || sendingMessage || isComplete}
                      >
                        <Icon as={isRecording ? FiMicOff : FiMic} w={4} h={4} mr={2} />
                        {!isSupported ? '不支持语音' : isRecording ? '停止录音' : '语音输入'}
                      </Button>
                      <LoadingButton
                        onClick={onSendMessage}
                        colorScheme="blue"
                        bg="blue.600"
                        _hover={{ bg: 'blue.700' }}
                        disabled={!inputText.trim() || isComplete}
                        isLoading={sendingMessage}
                        loadingText="发送中..."
                        flex={1}
                      >
                        <Icon as={FiSend} w={4} h={4} mr={2} />
                        发送消息
                      </LoadingButton>
                    </HStack>
                    {messages && messages.length > 0 && (
                      <Text fontSize="xs" color="blue.600" textAlign="center">
                        与 {customer?.name} 的销售对练进行中...
                      </Text>
                    )}
                  </VStack>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Container>
      </Box>
    </Box>
  )
}