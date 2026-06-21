import React from 'react'
import { XStack, Text } from 'tamagui'

export const CategoryBadge = ({ label, color = '$leafGreen9' }) => (
  <XStack backgroundColor={color} px="$2" py="$1" borderRadius="$1">
    <Text color="white" fontSize={10} fontWeight="800">
      {label.toUpperCase()}
    </Text>
  </XStack>
)
