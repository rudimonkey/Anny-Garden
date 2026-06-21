import { Stack } from 'expo-router';
import { TamaguiProvider } from 'tamagui';
import config from '@plantitas/ui/tamagui.config';

export default function RootLayout() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TamaguiProvider>
  );
}
