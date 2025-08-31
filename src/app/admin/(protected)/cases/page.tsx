'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
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
  Stack,
  Input,
  Textarea,
  Field,
  NumberInput
} from '@chakra-ui/react'
import { HiPencil, HiTrash, HiArrowLeft } from 'react-icons/hi2'
import axios from 'axios'
import { OverlayLoading } from '@/components/OverlayLoading'
import { LoadingButton } from '@/components/LoadingSystem'

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
  script: string
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
  script: string
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
  },
  script: ''
}

export default function CasesManagePage() {
  const [cases, setCases] = useState<CaseData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list')
  const [editingCase, setEditingCase] = useState<CaseData | null>(null)
  const [formData, setFormData] = useState<CaseFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingScript, setIsGeneratingScript] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/cases')
      setCases(response.data.cases)
    } catch (error) {
      console.error('Fetch cases error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleEdit = useCallback((caseData: CaseData) => {
    setEditingCase(caseData)
    setFormData({
      customerName: caseData.customerName,
      intro: caseData.intro,
      avatar: caseData.avatar,
      orderIndex: caseData.orderIndex,
      metaData: { ...caseData.metaData },
      script: caseData.script
    })
    setCurrentView('edit')
  }, [])

  const handleCreate = useCallback(() => {
    setEditingCase(null)
    setFormData(initialFormData)
    setCurrentView('create')
  }, [])

  const handleBack = useCallback(() => {
    setCurrentView('list')
    setEditingCase(null)
    setFormData(initialFormData)
    setErrors({})
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('确定要删除这个案例吗？')) return

    try {
      await axios.delete(`/api/admin/cases/${id}`)
      setCases(prev => prev.filter(c => c.id !== id))
    } catch (error) {
      console.error('Delete case error:', error)
      alert('删除失败')
    }
  }, [])

  const validateForm = useCallback(() => {
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
  }, [formData])

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      if (editingCase) {
        await axios.put(`/api/admin/cases/${editingCase.id}`, formData)
      } else {
        await axios.post('/api/admin/cases', formData)
      }
      
      await fetchCases()
      setCurrentView('list')
      setFormData(initialFormData)
      setEditingCase(null)
    } catch (error) {
      console.error('Submit case error:', error)
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || '操作失败')
      } else {
        alert('操作失败')
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [validateForm, editingCase, formData, fetchCases])

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

  const handleInputChange = (field: keyof CaseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleMetaDataChange = (field: keyof CaseFormData['metaData'], value: any) => {
    setFormData(prev => ({
      ...prev,
      metaData: { ...prev.metaData, [field]: value }
    }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const generateScript = async () => {
    if (!formData.customerName || !formData.intro) {
      alert('请先填写客户名称和介绍信息')
      return
    }

    setIsGeneratingScript(true)
    try {
      const response = await axios.post('/api/admin/generate-script', {
        customerName: formData.customerName,
        intro: formData.intro,
        personality: formData.metaData.personality,
        background: formData.metaData.background,
        budget: formData.metaData.budget,
        decisionLevel: formData.metaData.decision_level
      })

      setFormData(prev => ({ ...prev, script: response.data.script }))
    } catch (error) {
      console.error('Generate script error:', error)
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || '生成剧本失败')
      } else {
        alert('生成剧本失败')
      }
    } finally {
      setIsGeneratingScript(false)
    }
  }

  // 所有 useMemo 必须在条件返回之前
  const renderCreateForm = useMemo(() => (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="4xl" py={8}>
        <VStack align="stretch" gap={6}>
          <HStack>
            <IconButton
              aria-label="返回"
              onClick={handleBack}
              variant="ghost"
              size="lg"
            >
              <HiArrowLeft />
            </IconButton>
            <Box>
              <Heading size="lg" mb={2} color="gray.900">
                {editingCase ? '编辑案例' : '新增案例'}
              </Heading>
              <Text color="gray.600">
                {editingCase ? '修改案例信息' : '创建新的销售训练案例'}
              </Text>
            </Box>
          </HStack>

          <Card.Root bg="white" shadow="lg" borderRadius="xl">
            <Card.Body p={8}>
              <VStack align="stretch" gap={6}>
                <Stack direction={{ base: 'column', md: 'row' }} gap={6}>
                  <Field.Root invalid={!!errors.customerName}>
                    <Field.Label>客户名称</Field.Label>
                    <Input
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder="输入客户名称"
                    />
                    {errors.customerName && (
                      <Field.ErrorText>{errors.customerName}</Field.ErrorText>
                    )}
                  </Field.Root>

                  <Field.Root invalid={!!errors.avatar}>
                    <Field.Label>头像URL</Field.Label>
                    <Input
                      value={formData.avatar}
                      onChange={(e) => handleInputChange('avatar', e.target.value)}
                      placeholder="输入头像URL"
                    />
                    {errors.avatar && (
                      <Field.ErrorText>{errors.avatar}</Field.ErrorText>
                    )}
                  </Field.Root>

                  <Field.Root invalid={!!errors.orderIndex}>
                    <Field.Label>排序</Field.Label>
                    <NumberInput.Root                       
                      value={formData.orderIndex.toString()}
                      onValueChange={(details) => handleInputChange('orderIndex', parseInt(details.value) || 1)}
                      width="200px"
                    >
                      <NumberInput.Control />
                      <NumberInput.Input />
                    </NumberInput.Root>
                    {errors.orderIndex && (
                      <Field.ErrorText>{errors.orderIndex}</Field.ErrorText>
                    )}
                  </Field.Root>
                </Stack>

                <Field.Root invalid={!!errors.intro}>
                  <Field.Label>介绍</Field.Label>
                  <Textarea
                    value={formData.intro}
                    onChange={(e) => handleInputChange('intro', e.target.value)}
                    placeholder="输入客户介绍"
                    rows={3}
                  />
                  {errors.intro && (
                    <Field.ErrorText>{errors.intro}</Field.ErrorText>
                  )}
                </Field.Root>

                <Stack direction={{ base: 'column', md: 'row' }} gap={6}>
                  <Field.Root invalid={!!errors.budget}>
                    <Field.Label>预算</Field.Label>
                    <Input
                      value={formData.metaData.budget}
                      onChange={(e) => handleMetaDataChange('budget', e.target.value)}
                      placeholder="如：10-50万"
                    />
                    {errors.budget && (
                      <Field.ErrorText>{errors.budget}</Field.ErrorText>
                    )}
                  </Field.Root>

                  <Field.Root invalid={!!errors.decision_level}>
                    <Field.Label>决策级别</Field.Label>
                    <Input
                      value={formData.metaData.decision_level}
                      onChange={(e) => handleMetaDataChange('decision_level', e.target.value)}
                      placeholder="如：总监级别"
                    />
                    {errors.decision_level && (
                      <Field.ErrorText>{errors.decision_level}</Field.ErrorText>
                    )}
                  </Field.Root>
                </Stack>

                <Field.Root invalid={!!errors.background}>
                  <Field.Label>背景信息</Field.Label>
                  <Textarea
                    value={formData.metaData.background}
                    onChange={(e) => handleMetaDataChange('background', e.target.value)}
                    placeholder="输入客户背景信息"
                    rows={4}
                  />
                  {errors.background && (
                    <Field.ErrorText>{errors.background}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root>
                  <Field.Label>性格特征（用逗号分隔）</Field.Label>
                  <Input
                    value={formData.metaData.personality.join(', ')}
                    onChange={(e) => handleArrayInput('personality', e.target.value)}
                    placeholder="如：谨慎, 专业, 细致"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>关键要点（用逗号分隔）</Field.Label>
                  <Textarea
                    value={formData.metaData.points.join(', ')}
                    onChange={(e) => handleArrayInput('points', e.target.value)}
                    placeholder="输入关键要点，用逗号分隔"
                    rows={2}
                  />
                </Field.Root>

                {/* Script Generation Section */}
                <Box borderTop="1px solid" borderColor="gray.200" pt={6}>
                  <VStack align="stretch" gap={4}>
                    <HStack justify="space-between" align="center">
                      <Box>
                        <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                          销售剧本
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          基于客户信息生成个性化的销售对练剧本
                        </Text>
                      </Box>
                      <LoadingButton
                        colorScheme="green"
                        onClick={generateScript}
                        isLoading={isGeneratingScript}
                        loadingText="生成中..."
                        size="sm"
                      >
                        生成剧本
                      </LoadingButton>
                    </HStack>
                    
                    <Field.Root>
                      <Field.Label>剧本内容</Field.Label>
                      <Textarea
                        value={formData.script}
                        onChange={(e) => handleInputChange('script', e.target.value)}
                        placeholder="点击上方'生成剧本'按钮，系统将根据客户信息自动生成个性化的销售对练剧本..."
                        rows={8}
                        resize="vertical"
                      />
                    </Field.Root>
                  </VStack>
                </Box>

                <HStack justify="flex-end" gap={4} mt={6}>
                  <Button variant="outline" onClick={handleBack}>
                    取消
                  </Button>
                  <LoadingButton
                    colorScheme="blue"
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    loadingText={editingCase ? '更新中...' : '创建中...'}
                  >
                    {editingCase ? '更新案例' : '创建案例'}
                  </LoadingButton>
                </HStack>
              </VStack>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Container>
    </Box>
  ), [editingCase, formData, errors, isSubmitting, isGeneratingScript, handleBack, handleInputChange, handleMetaDataChange, handleSubmit, generateScript])

  const renderCasesList = useMemo(() => (
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
                            aria-label="编辑案例"
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => handleEdit(caseData)}
                          >
                            <HiPencil />
                          </IconButton>
                          <IconButton
                            aria-label="删除案例"
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleDelete(caseData.id)}
                          >
                            <HiTrash />
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
  ), [cases, handleCreate, handleEdit, handleDelete])

  if (loading) {
    return (
      <>
        <OverlayLoading isVisible={true} />
        <Box minH="100vh" bg="gray.50" />
      </>
    )
  }

  return (
    <>
      {currentView === 'list' ? renderCasesList : renderCreateForm}
    </>
  )
}