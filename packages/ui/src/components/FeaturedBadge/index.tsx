import React from 'react'
import { XStack, Text, Circle } from 'tamagui'
import { Star } from '@tamagui/lucide-icons'

export const FeaturedBadge = ({ label = 'DESTACADO' }) => (
  <XStack
    backgroundColor="$morningSky1"
    paddingHorizontal="$2"
    paddingVertical="$1"
    borderRadius="$1"
    alignItems="center"
    gap="$1"
  >
    <Star size={12} color="$leafGreen11" fill="$leafGreen11" />
    <Text color="$leafGreen11" fontSize={10} fontWeight="900" letterSpacing={0.5}>
      {label.toUpperCase()}
    </Text>
  </XStack>
)
