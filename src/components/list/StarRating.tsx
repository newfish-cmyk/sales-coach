import { memo } from 'react'
import { HStack, Icon } from '@chakra-ui/react'
import { FiStar } from 'react-icons/fi'

interface StarRatingProps {
  stars: number
  maxStars: number
}

export const StarRating = memo(function StarRating({ stars, maxStars }: StarRatingProps) {
  return (
    <HStack gap={1}>
      {Array.from({ length: maxStars }, (_, index) => (
        <Icon
          key={index}
          as={FiStar}
          w={4}
          h={4}
          color={index < stars ? 'yellow.400' : 'gray.300'}
          fill={index < stars ? 'yellow.400' : 'none'}
        />
      ))}
    </HStack>
  )
})