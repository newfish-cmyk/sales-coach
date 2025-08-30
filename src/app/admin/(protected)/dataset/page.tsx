'use client'

import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  Input,
  Badge,
  Table,
  Alert
} from '@chakra-ui/react'

interface UploadFile {
  name: string
  size: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  message?: string
}

export default function DatasetPage() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: UploadFile[] = Array.from(selectedFiles).map(file => ({
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const simulateUpload = async (fileIndex: number) => {
    const file = files[fileIndex]
    
    setFiles(prev => prev.map((f, i) => 
      i === fileIndex ? { ...f, status: 'uploading', progress: 0 } : f
    ))

    // 模拟上传进度
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, progress } : f
      ))
    }

    // 模拟成功或失败
    const success = Math.random() > 0.2 // 80% 成功率
    setFiles(prev => prev.map((f, i) => 
      i === fileIndex ? {
        ...f,
        status: success ? 'success' : 'error',
        progress: 100,
        message: success ? '上传成功' : '上传失败，请重试'
      } : f
    ))
  }

  const handleUploadAll = async () => {
    setIsUploading(true)
    
    const pendingFiles = files
      .map((file, index) => ({ file, index }))
      .filter(({ file }) => file.status === 'pending')

    for (const { index } of pendingFiles) {
      await simulateUpload(index)
    }
    
    setIsUploading(false)
  }

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusBadge = (status: UploadFile['status']) => {
    const statusConfig = {
      pending: { text: '等待中', colorScheme: 'gray' },
      uploading: { text: '上传中', colorScheme: 'blue' },
      success: { text: '成功', colorScheme: 'green' },
      error: { text: '失败', colorScheme: 'red' }
    }
    
    const config = statusConfig[status]
    return <Badge colorScheme={config.colorScheme} variant="subtle">{config.text}</Badge>
  }

  return (
    <VStack align="stretch" gap={6}>
      <Box>
        <Heading size="lg" mb={2}>
          数据集导入
        </Heading>
        <Text color="gray.600">
          上传训练数据集文件，支持 JSON、CSV、TXT 格式
        </Text>
      </Box>

      {/* Upload Area */}
      <Card.Root>
        <Card.Header>
          <Heading size="md">文件上传</Heading>
        </Card.Header>
        <Card.Body>
          <VStack gap={4}>
            <Box
              border="2px dashed"
              borderColor={isDragging ? 'blue.300' : 'gray.300'}
              borderRadius="lg"
              p={8}
              textAlign="center"
              bg={isDragging ? 'blue.50' : 'gray.50'}
              transition="all 0.2s"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              cursor="pointer"
            >
              <VStack gap={3}>
                <Text fontSize="4xl" opacity={0.6}>📁</Text>
                <VStack gap={1}>
                  <Text fontSize="lg" fontWeight="medium">
                    拖拽文件到此处或点击选择
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    支持 JSON、CSV、TXT 格式，单个文件最大 10MB
                  </Text>
                </VStack>
                <Input
                  type="file"
                  multiple
                  accept=".json,.csv,.txt"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  opacity={0}
                  position="absolute"
                  inset={0}
                  cursor="pointer"
                />
              </VStack>
            </Box>

            {files.length > 0 && (
              <HStack w="full" justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  已选择 {files.length} 个文件
                </Text>
                <HStack gap={2}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setFiles([])}
                    disabled={isUploading}
                  >
                    清空列表
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={handleUploadAll}
                    loading={isUploading}
                    disabled={files.length === 0 || files.every(f => f.status === 'success')}
                  >
                    上传全部
                  </Button>
                </HStack>
              </HStack>
            )}
          </VStack>
        </Card.Body>
      </Card.Root>

      {/* File List */}
      {files.length > 0 && (
        <Card.Root>
          <Card.Header>
            <Heading size="md">文件列表</Heading>
          </Card.Header>
          <Card.Body>
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>文件名</Table.ColumnHeader>
                  <Table.ColumnHeader>大小</Table.ColumnHeader>
                  <Table.ColumnHeader>状态</Table.ColumnHeader>
                  <Table.ColumnHeader>进度</Table.ColumnHeader>
                  <Table.ColumnHeader>操作</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {files.map((file, index) => (
                  <Table.Row key={`${file.name}-${index}`}>
                    <Table.Cell>
                      <Text fontWeight="medium" fontSize="sm">
                        {file.name}
                      </Text>
                      {file.message && (
                        <Text fontSize="xs" color={file.status === 'error' ? 'red.500' : 'green.500'}>
                          {file.message}
                        </Text>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm" color="gray.600">
                        {formatFileSize(file.size)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      {getStatusBadge(file.status)}
                    </Table.Cell>
                    <Table.Cell>
                      <Box w="100px">
                        {/* {file.status === 'uploading' ? (
                          <Progress
                            value={file.progress}
                            size="sm"
                            colorScheme="blue"
                          />
                        ) : ( */}
                          <Text fontSize="sm" color="gray.600">
                            {file.status === 'success' ? '100%' : '-'}
                          </Text>
                        {/* )} */}
                      </Box>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleRemoveFile(index)}
                        disabled={file.status === 'uploading'}
                      >
                        删除
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card.Body>
        </Card.Root>
      )}

      {/* Usage Instructions */}
      <Card.Root>
        <Card.Header>
          <Heading size="md">使用说明</Heading>
        </Card.Header>
        <Card.Body>
          <VStack align="stretch" gap={3}>
            <Alert.Root status="info">
              <Alert.Title>文件格式要求</Alert.Title>
              <Alert.Description>
                <VStack align="stretch" gap={2} mt={2}>
                  <Text fontSize="sm">• JSON: 每行一个完整的对话对象</Text>
                  <Text fontSize="sm">• CSV: 包含 question, answer 列</Text>
                  <Text fontSize="sm">• TXT: 问答对，每行以 Q: 或 A: 开头</Text>
                </VStack>
              </Alert.Description>
            </Alert.Root>
            
            <Alert.Root status="warning">
              <Alert.Title>注意事项</Alert.Title>
              <Alert.Description>
                <Text fontSize="sm">
                  上传的数据将用于训练AI模型，请确保数据质量和准确性。
                  建议先小批量测试，确认格式无误后再大批量上传。
                </Text>
              </Alert.Description>
            </Alert.Root>
          </VStack>
        </Card.Body>
      </Card.Root>
    </VStack>
  )
}