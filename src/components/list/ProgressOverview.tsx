import { memo } from 'react'
import { Box, SimpleGrid, VStack, Flex, Icon, Text } from '@chakra-ui/react'
import { FiAward, FiStar } from 'react-icons/fi'

interface ProgressSummary {
  completedCount: number
  totalCases: number
  totalStars: number
  maxTotalStars: number
  completionPercentage: number
}

interface ProgressOverviewProps {
  summary: ProgressSummary
}

export const ProgressOverview = memo(function ProgressOverview({ summary }: ProgressOverviewProps) {
  return (
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
  )
})