import {
  Box,
  VStack,
  Heading,
  Text,
  Alert
} from '@chakra-ui/react'

export default function DatasetPage() {
  return (
    <VStack align="stretch" gap={6}>
      <Box>
        <Heading size="lg" mb={2}>
          数据集管理
        </Heading>
        <Text color="gray.600">
          训练数据集管理和导入功能
        </Text>
      </Box>

      <Alert.Root status="info">
        <Alert.Title>功能开发中</Alert.Title>
        <Alert.Description>
          <Text fontSize="sm">
            数据集管理功能正在开发中，暂不支持使用。
          </Text>
        </Alert.Description>
      </Alert.Root>
    </VStack>
  )
}