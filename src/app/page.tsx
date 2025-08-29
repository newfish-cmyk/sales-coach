'use client'

import { useRouter } from 'next/navigation'
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
  SimpleGrid,
  Icon
} from '@chakra-ui/react'
import { 
  FiTarget, 
  FiTrendingUp, 
  FiUsers, 
  FiAward,
  FiShield,
  FiZap,
  FiStar
} from 'react-icons/fi'

export default function Home() {
  const router = useRouter()

  return (
    <Box>
      {/* Hero Section */}
      <Box py={20} px={4} textAlign="center" bg="white">
        <Container maxW="container.xl">
          <Badge
            colorScheme="blue"
            variant="subtle"
            px={4}
            py={2}
            borderRadius="full"
            mb={6}
            fontSize="sm"
            fontWeight="medium"
          >
            AI驱动的销售训练平台
          </Badge>
          <Heading
            size="4xl"
            color="gray.900"
            mb={6}
            lineHeight={1.2}
            fontWeight="bold"
          >
            让每一次销售对话
            <br />
            <Text as="span" color="blue.600">都成为成功</Text>
          </Heading>
          <Text
            fontSize="xl"
            color="gray.600"
            mb={8}
            maxW="2xl"
            mx="auto"
            lineHeight={1.6}
          >
            通过AI模拟真实客户场景，让销售团队在安全环境中练习、学习和提升。从新手到专家，每个人都能找到适合的挑战。
          </Text>
          <HStack justify="center" gap={4} flexDir={{ base: 'column', sm: 'row' }}>
            <Button
              size="lg"
              colorScheme="blue"
              px={8}
              py={6}
              fontSize="lg"
              onClick={() => router.push('/list')}
            >
              开始免费试用
            </Button>
            <Button
              variant="outline"
              size="lg"
              colorScheme="blue"
              px={8}
              py={6}
              fontSize="lg"
              bg="transparent"
            >
              观看演示
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} px={4}>
        <Container maxW="container.xl">
          <VStack textAlign="center" mb={16} gap={4}>
            <Heading size="2xl" color="gray.900" mb={4}>
              为什么选择我们的销售对练系统？
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="2xl">
              结合人工智能和游戏化设计，打造最有效的销售训练体验
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
            {[
              {
                icon: FiZap,
                title: 'AI智能客户',
                description: '基于真实客户数据训练的AI，模拟各种性格和需求的客户场景'
              },
              {
                icon: FiTarget,
                title: '个性化训练',
                description: '根据销售人员的技能水平和弱点，提供定制化的训练路径'
              },
              {
                icon: FiTrendingUp,
                title: '实时反馈',
                description: '即时分析对话质量，提供具体的改进建议和技巧指导'
              },
              {
                icon: FiUsers,
                title: '团队协作',
                description: '支持团队训练模式，管理者可以跟踪团队成员的进步情况'
              },
              {
                icon: FiShield,
                title: '安全环境',
                description: '在无风险的虚拟环境中练习，不用担心影响真实客户关系'
              },
              {
                icon: FiAward,
                title: '成就系统',
                description: '游戏化的星级评价和成就徽章，激发持续学习的动力'
              }
            ].map((feature, index) => (
              <Box
                key={index}
                borderWidth="2px"
                borderColor="gray.200"
                borderRadius="lg"
                p={6}
                bg="white"
                _hover={{ borderColor: 'blue.300' }}
                transition="border-color 0.2s"
              >
                <Icon as={feature.icon} w={12} h={12} color="blue.600" mb={4} />
                <Heading size="md" color="gray.900" mb={2}>
                  {feature.title}
                </Heading>
                <Text color="gray.600" lineHeight={1.6}>
                  {feature.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={20} px={4} bg="blue.50">
        <Container maxW="container.lg">
          <VStack textAlign="center" mb={16} gap={4}>
            <Heading size="2xl" color="gray.900" mb={4}>
              三步开始你的销售提升之旅
            </Heading>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            {[
              {
                step: '1',
                title: '选择训练场景',
                description: '从多种客户类型中选择，包括友好型、挑剔型、专业型等不同性格的AI客户'
              },
              {
                step: '2',
                title: '开始对话练习',
                description: '与AI客户进行真实的销售对话，系统会实时分析你的表现和话术效果'
              },
              {
                step: '3',
                title: '获得反馈提升',
                description: '收到详细的表现分析和改进建议，解锁新的挑战关卡，持续提升技能'
              }
            ].map((item, index) => (
              <VStack key={index} textAlign="center" gap={4}>
                <Flex
                  w={16}
                  h={16}
                  bg="blue.600"
                  color="white"
                  borderRadius="full"
                  align="center"
                  justify="center"
                  fontSize="2xl"
                  fontWeight="bold"
                >
                  {item.step}
                </Flex>
                <Heading size="lg" color="gray.900">
                  {item.title}
                </Heading>
                <Text color="gray.600" lineHeight={1.6}>
                  {item.description}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={20} px={4} bg="white">
        <Container maxW="container.lg">
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={8} textAlign="center">
            {[
              { number: '10,000+', label: '活跃用户' },
              { number: '95%', label: '技能提升率' },
              { number: '50+', label: '训练场景' },
              { number: '24/7', label: '随时训练' }
            ].map((stat, index) => (
              <VStack key={index} gap={2}>
                <Text fontSize="4xl" fontWeight="bold" color="blue.600">
                  {stat.number}
                </Text>
                <Text color="gray.600">{stat.label}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box py={20} px={4} bg="blue.50">
        <Container maxW="container.lg">
          <VStack textAlign="center" mb={16} gap={4}>
            <Heading size="2xl" color="gray.900">
              用户怎么说
            </Heading>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
            {[
              {
                text: '这个系统彻底改变了我们的销售培训方式。新员工现在可以在安全的环境中练习，而不用担心搞砸真实的客户关系。',
                name: '张经理',
                title: '某科技公司销售总监'
              },
              {
                text: 'AI客户的反应非常真实，让我能够练习各种困难的销售场景。我的成交率提升了40%！',
                name: '李销售',
                title: '资深销售代表'
              }
            ].map((testimonial, index) => (
              <Box
                key={index}
                bg="white"
                borderRadius="lg"
                p={6}
                borderWidth="1px"
                borderColor="gray.200"
              >
                <HStack mb={4}>
                  {Array(5).fill(0).map((_, i) => (
                    <Icon key={i} as={FiStar} color="blue.400" />
                  ))}
                </HStack>
                <Text color="gray.600" mb={4} lineHeight={1.6}>
                  &ldquo;{testimonial.text}&rdquo;
                </Text>
                <Box>
                  <Text fontWeight="semibold" color="gray.900">
                    {testimonial.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {testimonial.title}
                  </Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} px={4} bg="blue.600" color="white">
        <Container maxW="container.lg" textAlign="center">
          <Heading size="2xl" mb={4}>
            准备好提升你的销售技能了吗？
          </Heading>
          <Text fontSize="xl" mb={8} opacity={0.9}>
            加入数千名销售专业人士，开始你的AI驱动销售训练之旅
          </Text>
          <HStack justify="center" gap={4} flexDir={{ base: 'column', sm: 'row' }}>
            <Button
              size="lg"
              bg="white"
              color="blue.600"
              px={8}
              py={6}
              fontSize="lg"
              _hover={{ bg: 'gray.100' }}
              onClick={() => router.push('/list')}
            >
              立即开始免费试用
            </Button>
            <Button
              size="lg"
              variant="outline"
              borderColor="white"
              color="white"
              px={8}
              py={6}
              fontSize="lg"
              bg="transparent"
              _hover={{ bg: 'white', color: 'blue.600' }}
            >
              联系销售团队
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box py={12} px={4} bg="blue.50">
        <Container maxW="container.lg" textAlign="center">
          <Heading size="lg" color="gray.900" mb={4}>
            销售对练系统
          </Heading>
          <Text color="gray.600" mb={6}>
            让每一次对话都成为成功的机会
          </Text>
          <HStack justify="center" gap={6} fontSize="sm" color="gray.500">
            <Text cursor="pointer" _hover={{ color: 'gray.900' }}>
              关于我们
            </Text>
            <Text cursor="pointer" _hover={{ color: 'gray.900' }}>
              产品功能
            </Text>
            <Text cursor="pointer" _hover={{ color: 'gray.900' }}>
              定价方案
            </Text>
            <Text cursor="pointer" _hover={{ color: 'gray.900' }}>
              联系我们
            </Text>
          </HStack>
        </Container>
      </Box>
    </Box>
  )
}