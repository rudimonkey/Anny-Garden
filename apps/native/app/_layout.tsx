import React from 'react';
import { Stack } from 'expo-router';
import { TamaguiProvider, Theme } from 'tamagui';
import { config } from '@plantitas/ui';
import { initI18n } from '@plantitas/core';
import { initReactI18next } from 'react-i18next';
import { useEffect } from 'react';
import { ToastProvider, ToastViewport } from '@tamagui/toast';

export default function RootLayout() {
  useEffect(() => {
    initI18n('es', initReactI18next);
  }, []);

  return (
    <TamaguiProvider config={config}>
      <Theme name="light">
        <ToastProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="plants/[slug]" options={{ title: 'Detalle de Planta' }} />
          </Stack>
          <ToastViewport top="$8" left={0} right={0} />
        </ToastProvider>
      </Theme>
    </TamaguiProvider>
  );
}
