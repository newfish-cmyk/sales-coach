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
  Avatar
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

  if (loading) {
    return (
      <VStack align="center" justify="center" minH="400px">
        <Text>加载中...</Text>
      </VStack>
    )
  }

  return (
    <VStack align="stretch" gap={6}>
      <HStack justify="space-between">
        <Box>
          <Heading size="lg" mb={2}>
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
      <Card.Root>
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

      {/* Edit/Create Modal */}
      {/* <Modal.Root open={isModalOpen} onOpenChange={(e) => setIsModalOpen(e.open)} size="xl">
        <Modal.Backdrop />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              {editingCase ? '编辑案例' : '新增案例'}
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            <VStack gap={4}>
              <SimpleGrid columns={2} gap={4} w="full">
                <Field.Root invalid={!!errors.customerName}>
                  <Field.Label>客户名称</Field.Label>
                  <Input
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="请输入客户名称"
                  />
                  {errors.customerName && <Field.ErrorText>{errors.customerName}</Field.ErrorText>}
                </Field.Root>

                <Field.Root invalid={!!errors.orderIndex}>
                  <Field.Label>排序</Field.Label>
                  <Input
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData(prev => ({ ...prev, orderIndex: parseInt(e.target.value) || 1 }))}
                    placeholder="排序号"
                  />
                  {errors.orderIndex && <Field.ErrorText>{errors.orderIndex}</Field.ErrorText>}
                </Field.Root>
              </SimpleGrid>

              <Field.Root invalid={!!errors.avatar} w="full">
                <Field.Label>头像链接</Field.Label>
                <Input
                  value={formData.avatar}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="请输入头像链接"
                />
                {errors.avatar && <Field.ErrorText>{errors.avatar}</Field.ErrorText>}
              </Field.Root>

              <Field.Root invalid={!!errors.intro} w="full">
                <Field.Label>介绍</Field.Label>
                <Textarea
                  value={formData.intro}
                  onChange={(e) => setFormData(prev => ({ ...prev, intro: e.target.value }))}
                  placeholder="请输入客户介绍"
                  rows={3}
                />
                {errors.intro && <Field.ErrorText>{errors.intro}</Field.ErrorText>}
              </Field.Root>

              <SimpleGrid columns={2} gap={4} w="full">
                <Field.Root invalid={!!errors.budget}>
                  <Field.Label>预算</Field.Label>
                  <Input
                    value={formData.metaData.budget}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metaData: { ...prev.metaData, budget: e.target.value }
                    }))}
                    placeholder="如：10-50万"
                  />
                  {errors.budget && <Field.ErrorText>{errors.budget}</Field.ErrorText>}
                </Field.Root>

                <Field.Root invalid={!!errors.decision_level}>
                  <Field.Label>决策级别</Field.Label>
                  <Input
                    value={formData.metaData.decision_level}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metaData: { ...prev.metaData, decision_level: e.target.value }
                    }))}
                    placeholder="如：部门经理"
                  />
                  {errors.decision_level && <Field.ErrorText>{errors.decision_level}</Field.ErrorText>}
                </Field.Root>
              </SimpleGrid>

              <Field.Root w="full">
                <Field.Label>性格特征</Field.Label>
                <Input
                  value={formData.metaData.personality.join(', ')}
                  onChange={(e) => handleArrayInput('personality', e.target.value)}
                  placeholder="用逗号分隔，如：友好，谨慎，专业"
                />
                <Field.HelperText>
                  多个特征用逗号分隔
                </Field.HelperText>
              </Field.Root>

              <Field.Root w="full">
                <Field.Label>挑战要点</Field.Label>
                <Input
                  value={formData.metaData.points.join(', ')}
                  onChange={(e) => handleArrayInput('points', e.target.value)}
                  placeholder="用逗号分隔，如：价格敏感，需求不明确"
                />
                <Field.HelperText>
                  多个要点用逗号分隔
                </Field.HelperText>
              </Field.Root>

              <Field.Root invalid={!!errors.background} w="full">
                <Field.Label>背景信息</Field.Label>
                <Textarea
                  value={formData.metaData.background}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    metaData: { ...prev.metaData, background: e.target.value }
                  }))}
                  placeholder="请输入客户背景信息"
                  rows={4}
                />
                {errors.background && <Field.ErrorText>{errors.background}</Field.ErrorText>}
              </Field.Root>
            </VStack>
          </Modal.Body>

          <Modal.Footer>
            <HStack gap={3}>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                取消
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                loading={isSubmitting}
              >
                {editingCase ? '更新' : '创建'}
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root> */}
    </VStack>
  )
}