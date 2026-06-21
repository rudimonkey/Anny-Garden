import { YStack, Text, Button } from 'tamagui';
import { AlertTriangle } from '@tamagui/lucide-icons';
import React from 'react';

export interface ErrorBoundaryFallbackProps {
  error?: Error;
  resetErrorBoundary: () => void;
  message?: string;
}

export const ErrorBoundaryFallback = ({ error, resetErrorBoundary, message = "Algo salió mal" }: ErrorBoundaryFallbackProps) => {
  return (
    <YStack padding="$4" alignItems="center" justifyContent="center" space="$4" flex={1}>
      <AlertTriangle size={48} color="$alertRed9" />
      <Text fontSize="$6" fontWeight="bold" textAlign="center">{message}</Text>
      {error && <Text color="$gray10" textAlign="center">{error.message}</Text>}
      <Button onPress={resetErrorBoundary} backgroundColor="$leafGreen9" color="white">
        Reintentar
      </Button>
    </YStack>
  );
};
