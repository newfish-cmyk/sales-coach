'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  VStack,
  Icon,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { 
  FiDatabase, 
  FiTarget, 
  FiUsers, 
  FiCpu,
  FiTrendingUp
} from 'react-icons/fi'

const MotionBox = motion(Box)

const features = [
  {
    icon: FiDatabase,
    title: '原生数据导入',
    description: '智能知识库管理',
    details: '支持多种格式数据导入，自动构建销售知识图谱，让培训内容更加精准和实用'
  },
  {
    icon: FiTrendingUp,
    title: '闯关式学习',
    description: '游戏化培训体验', 
    details: '设计多层级关卡挑战，失败重来机制，根据评分智能调整难度，让学习更有趣'
  },
  {
    icon: FiUsers,
    title: '情景化训练',
    description: '真实场景模拟',
    details: '标准化销售流程，多角色扮演训练，提供个性化客户画像，提升实战能力'
  },
  {
    icon: FiTarget,
    title: '智能标签系统',
    description: '精准能力画像',
    details: '客户标签分析，销售能力评估，个性化学习路径推荐，精准提升短板'
  },
  {
    icon: FiTrendingUp,
    title: '可视化管理',
    description: '员工成长追踪',
    details: '实时数据分析，员工能力雷达图，成长轨迹可视化，让管理更科学'
  },
  {
    icon: FiCpu,
    title: 'AI智能辅导',
    description: '个性化学习建议',
    details: '基于学习数据的智能分析，提供个性化改进建议，加速能力提升'
  }
]

export default function Features() {

  return (
    <Box py={24} bg="white">
      <Container maxW="6xl" px={6}>
        {/* Section Header */}
        <VStack gap={6} textAlign="center" mb={16}>
          <Heading
            fontSize={{ base: '4xl', md: '5xl' }}
            fontWeight="bold"
            color="gray.900"
          >
            核心功能
          </Heading>
          <Text
            fontSize="xl"
            color="gray.600"
            maxW="3xl"
            mx="auto"
          >
            六大核心模块，打造完整的销售培训生态系统
          </Text>
        </VStack>
        
        {/* Features Grid */}
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
          gap={8}
        >
          {features.map((feature, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
            >
              <Box
                bg={'white'}
                p={6}
                borderRadius="xl"
                shadow="lg"
                _hover={{
                  shadow: '2xl',
                  transform: 'translateY(-8px)'
                }}
                transition="all 0.3s"
                bg="white"
                border="1px"
                borderColor="transparent"
                _dark={{
                  bg: 'gray.800',
                  borderColor: 'gray.600'
                }}
                position="relative"
                overflow="hidden"
                height="full"
              >
                {/* Icon */}
                <VStack gap={4} align="start" height="full">
                  <Box
                    w={16}
                    h={16}
                    bg="blue.600"
                    borderRadius="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    _groupHover={{ bg: 'blue.700' }}
                    transition="all 0.3s"
                    mx="auto"
                  >
                    <Icon as={feature.icon} boxSize={8} color="white" />
                  </Box>
                  
                  <VStack gap={2} align="center" textAlign="center" flex={1}>
                    <Heading
                      size="lg"
                      fontWeight="bold"
                      color="gray.900"
                      _groupHover={{ color: 'blue.600' }}
                      transition="colors 0.3s"
                    >
                      {feature.title}
                    </Heading>
                    <Text
                      color="blue.600"
                      fontWeight="semibold"
                      fontSize="sm"
                    >
                      {feature.description}
                    </Text>
                    <Text
                      color="gray.600"
                      lineHeight="relaxed"
                      fontSize="sm"
                    >
                      {feature.details}
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}