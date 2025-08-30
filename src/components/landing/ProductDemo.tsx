'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  VStack,
  HStack,
  Badge,
  Icon,
} from '@chakra-ui/react'
import { Progress } from '@chakra-ui/react'
import { 
  FiX,
  FiCheckCircle,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi'

export default function ProductDemo() {


  return (
    <Box py={24} bg="blue.50">
      <Container maxW="6xl" px={6}>
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={16} alignItems="center">
          {/* Left Content */}
          <VStack gap={8} align="start">
            <Box>
              <Badge bg="blue.100" color="blue.800" mb={4} px={3} py={1} borderRadius="md">
                产品优势
              </Badge>
              <Heading
                fontSize={{ base: '4xl', md: '5xl' }}
                fontWeight="bold"
                color="gray.900"
                mb={6}
                lineHeight="shorter"
              >
                解决销售培训
                <Text as="span" color="blue.600">三大痛点</Text>
              </Heading>
            </Box>
            
            <VStack gap={6} align="start">
              {[
                {
                  title: '人员流动导致培训成本高',
                  subtitle: '传统培训需要重复投入大量人力物力'
                },
                {
                  title: '培训效果难以量化评估',
                  subtitle: '缺乏科学的评估体系和数据支撑'
                },
                {
                  title: '新功能培训响应速度慢',
                  subtitle: '产品更新后培训跟不上，影响销售效果'
                }
              ].map((item, index) => (
                <HStack key={index} align="start" gap={4}>
                  <Box
                    w={8}
                    h={8}
                    bg="red.100"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    mt={1}
                  >
                    <Icon as={FiX} color="red.600" fontWeight="bold" />
                  </Box>
                  <VStack align="start" gap={2}>
                    <Heading size="sm" color="gray.900">
                      {item.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      {item.subtitle}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </VStack>
          
          {/* Right Demo */}
          <VStack gap={6}>
            {/* Training Progress Card */}
            <Box
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              w="full"
            >
              <Box
                bg={'white'}
                shadow="xl"
                borderRadius="xl"
                p={6}
                border="1px"
                borderColor="gray.200"
              >
                <HStack justify="space-between" mb={4}>
                  <Heading size="md" color="gray.900">
                    张小明的学习进度
                  </Heading>
                  <Badge bg="green.100" color="green.800" px={3} py={1} borderRadius="md">
                    进行中
                  </Badge>
                </HStack>
                
                <VStack gap={4}>
                  {[
                    { skill: '客户沟通技巧', progress: 80, color: 'blue' },
                    { skill: '产品知识掌握', progress: 90, color: 'green' },
                    { skill: '异议处理能力', progress: 60, color: 'yellow' }
                  ].map((item, index) => (
                    <HStack key={index} justify="space-between" w="full">
                      <Text fontSize="sm" color="gray.600">
                        {item.skill}
                      </Text>
                      <HStack gap={2}>
                        <Text fontSize="sm" color={`${item.color}.600`} fontWeight="semibold" minW="12">
                          {item.progress}%
                        </Text>
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
                
                <HStack mt={6} gap={4}>
                  <HStack gap={1}>
                    <Icon as={FiStar} color="yellow.500" />
                    <Text fontSize="sm" color="gray.600">
                      当前等级: 中级销售
                    </Text>
                  </HStack>
                  <HStack gap={1}>
                    <Icon as={FiTrendingUp} color="green.500" />
                    <Text fontSize="sm" color="gray.600">
                      本周提升 15%
                    </Text>
                  </HStack>
                </HStack>
              </Box>
            </Box>
            
            {/* Achievement Card */}
            <Box
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              w="full"
            >
              <Box
                bg="blue.500"
                color="white"
                shadow="xl"
                borderRadius="xl"
                p={6}
              >
                <HStack gap={3} mb={4}>
                  <Icon as={FiCheckCircle} boxSize={6} />
                  <Heading size="md">
                    恭喜！解锁新成就
                  </Heading>
                </HStack>
                <Text color="blue.100" mb={4}>
                  连续7天完成学习任务，获得"学习达人"徽章
                </Text>
                <HStack gap={2}>
                  <Badge bg="white" color="blue.600" px={3} py={1} borderRadius="md">
                    +50 积分
                  </Badge>
                  <Badge bg="blue.800" color="white" px={3} py={1} borderRadius="md">
                    学习达人
                  </Badge>
                </HStack>
              </Box>
            </Box>
          </VStack>
        </Grid>
      </Container>
    </Box>
  )
}