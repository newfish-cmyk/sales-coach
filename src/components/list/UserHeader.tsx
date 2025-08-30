import { memo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  HStack,
  Heading,
  VStack,
  Text,
  Button,
  Icon,
  Separator,
} from '@chakra-ui/react'
import { Popover } from '@chakra-ui/react'
import { FiUser, FiLogOut } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'

export const UserHeader = memo(function UserHeader() {
  const router = useRouter()
  const { user, logout } = useAuth()

  return (
    <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
      <Container maxW="container.xl">
        <HStack justify="space-between" align="center">
          <Heading 
            size="lg" 
            color="gray.900"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ color: "blue.600", transform: "scale(1.05)" }}
            onClick={() => {
              router.push('/')
            }}
          >
            销售对练系统
          </Heading>
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button
                bg="blue.600"
                borderRadius="full"
                w={10}
                h={10}
                minW="auto"
                _hover={{ bg: "blue.700" }}
                transition="background-color 0.2s"
              >
                <Icon as={FiUser} w={5} h={5} color="white" />
              </Button>
            </Popover.Trigger>
            <Popover.Positioner>
              <Popover.Content w="200px">
                <Popover.Arrow>
                  <Popover.ArrowTip />
                </Popover.Arrow>
                <Popover.Body>
                  <VStack gap={3} align="stretch">
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        当前用户
                      </Text>
                      <Text fontWeight="semibold" color="gray.900">
                        {user?.username || '用户'}
                      </Text>
                    </Box>
                    <Separator />
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="red"
                      onClick={async () => {
                        // 立即跳转，避免状态更新导致的认证检查
                        router.push('/')
                        await logout()
                      }}
                    >
                      <Icon as={FiLogOut} mr={2} />登出
                    </Button>
                  </VStack>
                </Popover.Body>
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Root>
        </HStack>
      </Container>
    </Box>
  )
})