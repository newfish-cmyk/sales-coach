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
import { motion } from 'framer-motion'
import { FiArrowRight, FiPhone, FiMail } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

const MotionBox = motion(Box)

export default function CTA() {
  const router = useRouter()

  return (
    <Box
      py={24}
      bg="blue.600"
      position="relative"
      overflow="hidden"
    >
      {/* Background Elements */}
      <Box
        position="absolute"
        inset="0"
        opacity="0.1"
        bgImage="/api/placeholder/100/100"
        bgRepeat="repeat"
        bgSize="50px 50px"
      />
      <MotionBox
        position="absolute"
        top="0"
        right="0"
        w="96"
        h="96"
        bg="blue.500"
        borderRadius="full"
        opacity="0.2"
        transform="translate(48px, -48px)"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <MotionBox
        position="absolute"
        bottom="0"
        left="0"
        w="64"
        h="64"
        bg="blue.400"
        borderRadius="full"
        opacity="0.2"
        transform="translate(-32px, 32px)"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <Container maxW="6xl" px={6} position="relative" zIndex={10}>
        <VStack gap={16} align="center">
          {/* Header */}
          <VStack gap={6} textAlign="center">
            <Heading
              fontSize={{ base: '4xl', md: '5xl' }}
              fontWeight="bold"
              color="white"
              lineHeight="shorter"
            >
              准备好提升您的销售团队了吗？
            </Heading>
            <Text
              fontSize="xl"
              color="blue.100"
              maxW="2xl"
              mx="auto"
            >
              立即开始免费试用，体验智能化销售培训的强大效果
            </Text>
          </VStack>
          
          {/* Features Cards */}
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap={8}
            maxW="4xl"
            w="full"
          >
            {[
              { number: '7天', label: '免费试用' },
              { number: '24/7', label: '技术支持' },
              { number: '定制', label: '专属方案' }
            ].map((item, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  bg="whiteAlpha.100"
                  backdropFilter="blur(10px)"
                  border="1px"
                  borderColor="whiteAlpha.200"
                  color="white"
                  p={6}
                  borderRadius="xl"
                  textAlign="center"
                >
                  <Text fontSize="3xl" fontWeight="bold" color="blue.200" mb={2}>
                    {item.number}
                  </Text>
                  <Text color="blue.100">
                    {item.label}
                  </Text>
                </Box>
              </MotionBox>
            ))}
          </Grid>
          
          {/* CTA Buttons */}
          <HStack
            gap={4}
            flexDirection={{ base: 'column', sm: 'row' }}
            w="full"
            justifyContent="center"
          >
            <Button
              size="lg"
              bg="white"
              color="blue.600"
              _hover={{ 
                bg: 'blue.50',
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
              立即免费试用<Icon as={FiArrowRight} />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              borderColor="white"
              color="white"
              _hover={{ bg: 'whiteAlpha.100' }}
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="semibold"
              borderRadius="xl"
              borderWidth="2px"
              transition="all 0.3s"
            >
              预约演示
            </Button>
          </HStack>
          
          {/* Contact Info */}
          <VStack gap={4} textAlign="center">
            <Text color="blue.200">
              联系我们获取更多信息
            </Text>
            <HStack
              gap={4}
              flexDirection={{ base: 'column', sm: 'row' }}
              color="blue.100"
            >
              <HStack gap={2}>
                <Icon as={FiPhone} />
                <Text>400-888-9999</Text>
              </HStack>
              <HStack gap={2}>
                <Icon as={FiMail} />
                <Text>sales@salestraining.com</Text>
              </HStack>
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}