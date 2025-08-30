import { memo, useCallback } from 'react'
import { Box, VStack, HStack, Flex, Heading, Text, Icon } from '@chakra-ui/react'
import { FiLock, FiCheckCircle } from 'react-icons/fi'
import Image from 'next/image'
import { StarRating } from './StarRating'

interface CaseProgress {
  isCompleted: boolean
  bestStars: number
  totalAttempts: number
}

interface CaseData {
  caseId: string
  customerName: string
  intro: string
  avatar?: string
  isLocked: boolean
  progress: CaseProgress
  metaData: {
    decision_level: string
  }
}

interface CaseCardProps {
  case_: CaseData
  index: number
  onClick: (caseId: string, isLocked: boolean) => void
}

export const CaseCard = memo(function CaseCard({ case_, index, onClick }: CaseCardProps) {
  const handleClick = useCallback(() => {
    onClick(case_.caseId, case_.isLocked)
  }, [case_.caseId, case_.isLocked, onClick])

  return (
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
        onClick={handleClick}
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
                    <Image
                      src={case_.avatar}
                      alt={case_.customerName}
                      width={48}
                      height={48}
                      className="object-cover rounded-full"
                      priority={index < 3} // 前3个优先加载
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
  )
})