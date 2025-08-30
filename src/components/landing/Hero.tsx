'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Grid,
  Icon,
} from '@chakra-ui/react'
import { FiArrowRight, FiPlay } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const router = useRouter()

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
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
      
      <Container maxW="6xl" px={6} textAlign="center" position="relative" zIndex={10}>
        <VStack gap={8} maxW="4xl" mx="auto">
          {/* Main Headline */}
          <VStack gap={4}>
            <Heading
              fontSize={{ base: '4xl', md: '6xl' }}
              fontWeight="bold"
              color="gray.900"
              mb={6}
            >
              让每一次销售对话
            </Heading>
            <Heading
              fontSize={{ base: '4xl', md: '6xl' }}
              fontWeight="bold"
              color="blue.600"
            >
              都成为成功
            </Heading>
          </VStack>
          
          {/* Subtitle */}
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="gray.600"
            maxW="2xl"
            mx="auto"
            lineHeight="relaxed"
          >
            专业销售培训平台，闯关式学习+情景化训练
            <br />
            <Text as="span" color="blue.600" fontWeight="semibold">
              降低80%培训成本，提升团队核心竞争力
            </Text>
          </Text>
          
          {/* CTA Buttons */}
          <HStack
            gap={4}
            pt={8}
            flexDirection={{ base: 'column', sm: 'row' }}
            w="full"
            justifyContent="center"
          >
            <Button
              size="lg"
              bg="blue.600"
              color="white"
              _hover={{ 
                bg: 'blue.700',
                transform: 'scale(1.05)'
              }}
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="semibold"
              borderRadius="xl"
              shadow="lg"
              _active={{ transform: 'scale(0.98)' }}
              onClick={() => router.push('/register')}
              transition="all 0.3s"
            >
              立即体验<Icon as={FiArrowRight} />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              borderColor="blue.600"
              color="blue.600"
              _hover={{ bg: 'blue.50' }}
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="semibold"
              borderRadius="xl"
              borderWidth="2px"
              transition="all 0.3s"
            >
             <Icon as={FiPlay} /> 观看演示
            </Button>
          </HStack>
          
          {/* Stats */}
          <Grid
            templateColumns="repeat(3, 1fr)"
            gap={8}
            pt={16}
            maxW="2xl"
            mx="auto"
            w="full"
          >
            <VStack>
              <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                80%
              </Text>
              <Text color="gray.600" fontSize="sm">
                培训成本降低
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                3倍
              </Text>
              <Text color="gray.600" fontSize="sm">
                学习效率提升
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                95%
              </Text>
              <Text color="gray.600" fontSize="sm">
                用户满意度
              </Text>
            </VStack>
          </Grid>
        </VStack>
      </Container>
    </Box>
  )
}