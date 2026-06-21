import { XStack, Text } from 'tamagui';
import { Star } from '@tamagui/lucide-icons';
import React from 'react';

export interface FeaturedBadgeProps {
  locale?: 'es' | 'en';
}

export const FeaturedBadge = ({ locale = 'es' }: FeaturedBadgeProps) => {
  const label = locale === 'es' ? 'DESTACADO' : 'FEATURED';
  return (
    <XStack
      backgroundColor="$morningSky1"
      paddingHorizontal="$2"
      paddingVertical="$1"
      borderRadius="$1"
      alignItems="center"
      space="$1"
    >
      <Star size={12} color="$leafGreen11" />
      <Text color="$leafGreen11" fontSize="$1" fontWeight="bold">
        {label}
      </Text>
    </XStack>
  );
};
