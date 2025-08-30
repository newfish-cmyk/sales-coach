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
  IconButton,
  Tag,
  Avatar,
  Container,
  SimpleGrid,
  Stack
} from '@chakra-ui/react'

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
    <Box minH="100vh" bg="gray.50">
      <Container maxW="6xl" py={8}>
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

          {/* Cases Cards */}
          {cases.length === 0 ? (
            <Card.Root bg="white" shadow="lg" borderRadius="xl">
              <Card.Body>
                <VStack py={8}>
                  <Text color="gray.500">暂无案例数据</Text>
                  <Button colorScheme="blue" onClick={handleCreate}>
                    创建第一个案例
                  </Button>
                </VStack>
              </Card.Body>
            </Card.Root>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
              {cases.map((caseData) => (
                <Card.Root key={caseData.id} bg="white" shadow="lg" borderRadius="xl" overflow="hidden">
                  <Card.Body p={6}>
                    <VStack align="stretch" gap={4}>
                      {/* Header with Avatar and Name */}
                      <HStack justify="space-between" align="start">
                        <HStack>
                          <Avatar.Root size="md">
                            <Avatar.Image src={caseData.avatar} />
                            <Avatar.Fallback>
                              {caseData.customerName.charAt(0)}
                            </Avatar.Fallback>
                          </Avatar.Root>
                          <Box>
                            <Text fontWeight="bold" fontSize="lg">
                              {caseData.customerName}
                            </Text>
                            <Badge colorScheme="blue" variant="subtle" size="sm">
                              排序 {caseData.orderIndex}
                            </Badge>
                          </Box>
                        </HStack>
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
                      </HStack>

                      {/* Introduction */}
                      <Box>
                        <Text fontSize="sm" color="gray.600" lineHeight="tall">
                          {caseData.intro}
                        </Text>
                      </Box>

                      {/* Metadata */}
                      <Stack gap={3}>
                        <HStack justify="space-between">
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">
                            预算:
                          </Text>
                          <Text fontSize="sm" color="green.600" fontWeight="medium">
                            {caseData.metaData.budget}
                          </Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">
                            决策级别:
                          </Text>
                          <Text fontSize="sm" color="blue.600" fontWeight="medium">
                            {caseData.metaData.decision_level}
                          </Text>
                        </HStack>
                      </Stack>

                      {/* Personality Tags */}
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                          性格标签:
                        </Text>
                        <HStack flexWrap="wrap" gap={1}>
                          {caseData.metaData.personality.map((trait, index) => (
                            <Tag.Root key={index} size="sm" colorScheme="purple" variant="subtle">
                              {trait}
                            </Tag.Root>
                          ))}
                        </HStack>
                      </Box>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  )
}