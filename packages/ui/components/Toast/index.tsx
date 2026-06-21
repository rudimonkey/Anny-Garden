import { Toast as TamaguiToast, YStack, Text } from 'tamagui';
import React from 'react';

export interface ToastProps {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
}

export const Toast = ({ title, description, type = 'info' }: ToastProps) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '$leafGreen9';
      case 'error': return '$alertRed9';
      default: return '$morningSky1';
    }
  };

  const getTextColor = () => {
    return type === 'info' ? '$leafGreen11' : 'white';
  };

  return (
    <TamaguiToast
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="quick"
      backgroundColor={getBackgroundColor()}
      borderRadius="$4"
      padding="$3"
    >
      <YStack>
        <TamaguiToast.Title color={getTextColor()} fontWeight="bold">{title}</TamaguiToast.Title>
        {description && (
          <TamaguiToast.Description color={getTextColor()}>
            {description}
          </TamaguiToast.Description>
        )}
      </YStack>
    </TamaguiToast>
  );
};
