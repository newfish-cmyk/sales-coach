import {
  Box,
  VStack,
  Heading,
  Text,
  Alert
} from '@chakra-ui/react'

export default function AdminDashboard() {
  return (
    <VStack align="stretch" gap={6}>
      <Box>
        <Heading size="lg" mb={2}>
          仪表盘
        </Heading>
        <Text color="gray.600">
          系统数据统计和概览
        </Text>
      </Box>

      <Alert.Root status="info">
        <Alert.Title>功能开发中</Alert.Title>
        <Alert.Description>
          <Text fontSize="sm">
            仪表盘功能正在开发中，暂不支持使用。
          </Text>
        </Alert.Description>
      </Alert.Root>
    </VStack>
  )
}