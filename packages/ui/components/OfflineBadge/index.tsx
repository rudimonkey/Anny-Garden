import { XStack, Text } from 'tamagui';
import { WifiOff } from '@tamagui/lucide-icons';
import React from 'react';

export const OfflineBadge = () => {
  return (
    <XStack
      backgroundColor="$guestGray5"
      paddingHorizontal="$2"
      paddingVertical="$1"
      borderRadius="$1"
      alignItems="center"
      space="$1"
    >
      <WifiOff size={12} color="white" />
      <Text color="white" fontSize="$1" fontWeight="bold">
        OFFLINE
      </Text>
    </XStack>
  );
};
