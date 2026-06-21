import React from 'react'
import { YStack, Text, XStack } from 'tamagui'
import { Info, AlertCircle } from '@tamagui/lucide-icons'

export const Toast = ({ message, type = 'info' }) => (
  <XStack
    backgroundColor={type === 'error' ? '$alertRed9' : '$leafGreen11'}
    px="$4"
    py="$3"
    borderRadius="$4"
    alignItems="center"
    gap="$3"
    elevation="$4"
    animation="quick"
    enterStyle={{ opacity: 0, scale: 0.9, y: 20 }}
  >
    {type === 'error' ? <AlertCircle color="white" /> : <Info color="white" />}
    <Text color="white" fontWeight="600">
      {message}
    </Text>
  </XStack>
)
