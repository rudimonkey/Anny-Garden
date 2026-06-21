import React from 'react';
import { ScrollView, YStack, Text, XStack } from 'tamagui';
import { usePlantStore } from '@plantitas/core';
import { PlantCard } from '@plantitas/ui';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function CollectionScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { plants, pinnedIds } = usePlantStore();

  const pinnedPlants = plants.filter(p => pinnedIds.includes(p.slug));

  return (
    <ScrollView backgroundColor="$leafGreen1">
      <YStack padding="$4" space="$4">
        <YStack space="$2">
          <Text fontSize="$8" fontWeight="bold" color="$leafGreen11">
            {t('nav.collection')}
          </Text>
          <Text fontSize="$4" color="$gray10">
            {i18n.language === 'es' ? 'Tus plantas favoritas guardadas.' : 'Your saved favorite plants.'}
          </Text>
        </YStack>

        <YStack space="$4" alignItems="center">
          {pinnedPlants.length > 0 ? (
            pinnedPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                locale={i18n.language as any}
                onPress={() => router.push(`/plants/${plant.slug}`)}
              />
            ))
          ) : (
            <YStack padding="$10" alignItems="center" space="$4">
              <Text color="$gray10" fontSize="$5">No tienes plantas guardadas aún.</Text>
            </YStack>
          )}
        </YStack>
      </YStack>
    </ScrollView>
  );
}
