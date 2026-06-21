import React from 'react';
import { ScrollView, YStack, Text, XStack } from 'tamagui';
import { usePlantStore } from '@plantitas/core';
import { PlantCard } from '@plantitas/ui';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { plants } = usePlantStore();

  const featuredPlants = plants.filter(p => p.featured);

  return (
    <ScrollView backgroundColor="$leafGreen1">
      <YStack padding="$4" space="$4">
        <YStack space="$2">
          <Text fontSize="$8" fontWeight="bold" color="$leafGreen11">
            {i18n.language === 'es' ? '¡Hola, Plant Lover!' : 'Hello, Plant Lover!'}
          </Text>
          <Text fontSize="$4" color="$gray10">
            {i18n.language === 'es' ? 'Descubre nuevas especies para tu colección.' : 'Discover new species for your collection.'}
          </Text>
        </YStack>

        <YStack space="$3">
          <Text fontSize="$6" fontWeight="bold" color="$leafGreen11">
            {t('plant.featured')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack space="$4" paddingVertical="$2" paddingHorizontal="$1">
              {featuredPlants.map((plant) => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  locale={i18n.language as any}
                  onPress={() => router.push(`/plants/${plant.slug}`)}
                />
              ))}
            </XStack>
          </ScrollView>
        </YStack>

        <YStack space="$3">
          <Text fontSize="$6" fontWeight="bold" color="$leafGreen11">
            {i18n.language === 'es' ? 'Recién llegadas' : 'New arrivals'}
          </Text>
          <YStack space="$4" alignItems="center">
            {plants.slice(0, 10).map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                locale={i18n.language as any}
                onPress={() => router.push(`/plants/${plant.slug}`)}
              />
            ))}
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
