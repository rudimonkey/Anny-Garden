import { Badge, Text, XStack, YStack } from 'tamagui';
import React from 'react';

export interface CategoryBadgeProps {
  label: string;
  type?: 'habitat' | 'use' | 'difficulty' | 'pollinator';
}

export const CategoryBadge = ({ label, type = 'use' }: CategoryBadgeProps) => {
  const getBadgeColor = () => {
    switch (type) {
      case 'habitat': return '$leafGreen9';
      case 'use': return '$soilBrown6';
      case 'difficulty': return '$alertRed9';
      case 'pollinator': return '$morningSky1';
      default: return '$leafGreen9';
    }
  };

  return (
    <XStack
      backgroundColor={getBadgeColor()}
      paddingHorizontal="$2"
      paddingVertical="$1"
      borderRadius="$1"
    >
      <Text color="white" fontSize="$1" fontWeight="bold">
        {label}
      </Text>
    </XStack>
  );
};
