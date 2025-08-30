'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  Badge,
  Table,
  IconButton,
  // Modal,
  Input,
  Textarea,
  SimpleGrid,
  Field,
  Tag,
  Avatar,
  Container
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

interface CaseData {
  id: string
  customerName: string
  intro: string
  avatar: string
  orderIndex: number
  metaData: {
    budget: string
    decision_level: string
    personality: string[]
    points: string[]
    background: string
  }
  createdAt: string
}

interface CaseFormData {
  customerName: string
  intro: string
  avatar: string
  orderIndex: number
  metaData: {
    budget: string
    decision_level: string
    personality: string[]
    points: string[]
    background: string
  }
}

const initialFormData: CaseFormData = {
  customerName: '',
  intro: '',
  avatar: '',
  orderIndex: 1,
  metaData: {
    budget: '',
    decision_level: '',
    personality: [],
    points: [],
    background: ''
  }
}

export default function CasesManagePage() {
  const [cases, setCases] = useState<CaseData[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCase, setEditingCase] = useState<CaseData | null>(null)
  const [formData, setFormData] = useState<CaseFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/admin/cases')
      if (response.ok) {
        const data = await response.json()
        setCases(data.cases)
      }
    } catch (error) {
      console.error('Fetch cases error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (caseData: CaseData) => {
    setEditingCase(caseData)
    setFormData({
      customerName: caseData.customerName,
      intro: caseData.intro,
      avatar: caseData.avatar,
      orderIndex: caseData.orderIndex,
      metaData: { ...caseData.metaData }
    })
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingCase(null)
    setFormData(initialFormData)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个案例吗？')) return

    try {
      const response = await fetch(`/api/admin/cases/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setCases(prev => prev.filter(c => c.id !== id))
      } else {
        alert('删除失败')
      }
    } catch (error) {
      console.error('Delete case error:', error)
      alert('删除失败')
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = '客户名称不能为空'
    }
    
    if (!formData.intro.trim()) {
      newErrors.intro = '介绍不能为空'
    }
    
    if (!formData.avatar.trim()) {
      newErrors.avatar = '头像不能为空'
    }
    
    if (formData.orderIndex < 1) {
      newErrors.orderIndex = '排序必须大于0'
    }
    
    if (!formData.metaData.budget.trim()) {
      newErrors.budget = '预算不能为空'
    }
    
    if (!formData.metaData.decision_level.trim()) {
      newErrors.decision_level = '决策级别不能为空'
    }
    
    if (!formData.metaData.background.trim()) {
      newErrors.background = '背景不能为空'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const url = editingCase ? `/api/admin/cases/${editingCase.id}` : '/api/admin/cases'
      const method = editingCase ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        await fetchCases()
        setIsModalOpen(false)
        setFormData(initialFormData)
        setEditingCase(null)
      } else {
        const data = await response.json()
        alert(data.error || '操作失败')
      }
    } catch (error) {
      console.error('Submit case error:', error)
      alert('操作失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleArrayInput = (field: 'personality' | 'points', value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean)
    setFormData(prev => ({
      ...prev,
      metaData: {
        ...prev.metaData,
        [field]: array
      }
    }))
  }


  return (
    <Box
      minH="100vh"
      bg="blue.50"
      position="relative"
      overflow="hidden"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        inset="0"
        opacity="0.05"
        bgImage="/api/placeholder/100/100"
        bgRepeat="repeat"
        bgSize="50px 50px"
      />
      
      {/* Floating Elements */}
      <MotionBox
        position="absolute"
        top="20"
        left="20"
        w="32"
        h="32"
        bg="blue.200"
        borderRadius="full"
        opacity="0.2"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <MotionBox
        position="absolute"
        bottom="20"
        right="20"
        w="24"
        h="24"
        bg="blue.300"
        borderRadius="full"
        opacity="0.2"
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <MotionBox
        position="absolute"
        top="40"
        right="32"
        w="16"
        h="16"
        bg="blue.400"
        borderRadius="full"
        opacity="0.15"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <Container maxW="6xl" py={8} position="relative" zIndex={10}>
        <VStack align="stretch" gap={6}>
          <HStack justify="space-between">
            <Box>
              <Heading size="lg" mb={2} color="gray.900">
                案例管理
              </Heading>
              <Text color="gray.600">
                管理销售训练案例，支持增删改查操作
              </Text>
            </Box>
            <Button colorScheme="blue" onClick={handleCreate}>
              新增案例
            </Button>
          </HStack>

          {/* Cases Table */}
          <Card.Root bg="white" shadow="lg" borderRadius="xl">
            <Card.Body>
              {cases.length === 0 ? (
                <VStack py={8}>
                  <Text color="gray.500">暂无案例数据</Text>
                  <Button colorScheme="blue" onClick={handleCreate}>
                    创建第一个案例
                  </Button>
                </VStack>
              ) : (
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>排序</Table.ColumnHeader>
                      <Table.ColumnHeader>客户</Table.ColumnHeader>
                      <Table.ColumnHeader>介绍</Table.ColumnHeader>
                      <Table.ColumnHeader>预算</Table.ColumnHeader>
                      <Table.ColumnHeader>决策级别</Table.ColumnHeader>
                      <Table.ColumnHeader>性格标签</Table.ColumnHeader>
                      <Table.ColumnHeader>操作</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {cases.map((caseData) => (
                      <Table.Row key={caseData.id}>
                        <Table.Cell>
                          <Badge colorScheme="blue" variant="subtle">
                            {caseData.orderIndex}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <HStack>
                            <Avatar.Root >
                              <Avatar.Image src={caseData.avatar} />
                              <Avatar.Fallback>
                                {caseData.customerName.charAt(0)}
                              </Avatar.Fallback>
                            </Avatar.Root>
                            <Text fontWeight="medium">{caseData.customerName}</Text>
                          </HStack>
                        </Table.Cell>
                        <Table.Cell>
                          <Text fontSize="sm" maxW="200px">
                            {caseData.intro}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text fontSize="sm">{caseData.metaData.budget}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text fontSize="sm">{caseData.metaData.decision_level}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <HStack flexWrap="wrap" gap={1}>
                            {caseData.metaData.personality.slice(0, 2).map((trait, index) => (
                              <Tag.Root key={index} size="sm" colorScheme="purple" variant="subtle">
                                {trait}
                              </Tag.Root>
                            ))}
                            {caseData.metaData.personality.length > 2 && (
                              <Tag.Root size="sm" variant="subtle">
                                +{caseData.metaData.personality.length - 2}
                              </Tag.Root>
                            )}
                          </HStack>
                        </Table.Cell>
                        <Table.Cell>
                          <HStack gap={1}>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(caseData)}
                            >
                              ✏️
                            </IconButton>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDelete(caseData.id)}
                            >
                              🗑️
                            </IconButton>
                          </HStack>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              )}
            </Card.Body>
          </Card.Root>
        </VStack>
      </Container>
    </Box>
  )
}