import React from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import { ScrollView, YStack, XStack, Text, Image, Button } from 'tamagui';
import { getMockPlantBySlug, usePlantStore } from '@plantitas/core';
import { CategoryBadge, Toast } from '@plantitas/ui';
import { useTranslation } from 'react-i18next';
import { Heart } from '@tamagui/lucide-icons';
import { useToastController } from '@tamagui/toast';

export default function PlantDetailScreen() {
  const { t, i18n } = useTranslation();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { togglePin, isPinned } = usePlantStore();
  const plant = getMockPlantBySlug(slug);
  const toast = useToastController();

  if (!plant) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Text>Planta no encontrada</Text>
      </YStack>
    );
  }

  const pinned = isPinned(plant.slug);
  const primaryImage = plant.images.find(img => img.isPrimary) || plant.images[0];

  const handleTogglePin = () => {
    togglePin(plant.slug);
    const isNowPinned = !pinned;
    toast.show(isNowPinned ? 'Añadido a favoritos' : 'Eliminado de favoritos', {
        type: isNowPinned ? 'success' : 'info',
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: i18n.language === 'es' ? plant.labelES : plant.labelEN,
          headerRight: () => (
            <Button
              chromeless
              icon={<Heart fill={pinned ? "$alertRed9" : "none"} color={pinned ? "$alertRed9" : "$gray10"} />}
              onPress={handleTogglePin}
            />
          )
        }}
      />
      <ScrollView backgroundColor="white">
        <YStack>
          {primaryImage && (
            <Image
              source={{ uri: primaryImage.url }}
              width="100%"
              height={300}
              objectFit="cover"
            />
          )}

          <YStack padding="$4" space="$4">
            <YStack>
              <Text fontSize="$9" fontWeight="bold" color="$leafGreen11">
                {i18n.language === 'es' ? plant.labelES : plant.labelEN}
              </Text>
              <Text fontSize="$5" fontStyle="italic" color="$gray10">
                {plant.scientificName}
              </Text>
            </YStack>

            <XStack space="$2" flexWrap="wrap">
              {plant.facets.habitat.map(h => <CategoryBadge key={h} label={h} type="habitat" />)}
              {plant.facets.use.map(u => <CategoryBadge key={u} label={u} type="use" />)}
            </XStack>

            <YStack space="$2" backgroundColor="$leafGreen1" padding="$4" borderRadius="$4">
              <Text fontWeight="bold" color="$leafGreen11">
                {i18n.language === 'es' ? 'Sobre esta planta' : 'About this plant'}
              </Text>
              <Text color="$gray11">{plant.metaDescription}</Text>
            </YStack>

            <YStack space="$2">
              <Text fontSize="$6" fontWeight="bold" color="$leafGreen11">{t('plant.tips')}</Text>
              {(i18n.language === 'es' ? plant.careTipsES : plant.careTips).map((tip, i) => (
                <XStack key={i} space="$2" alignItems="flex-start">
                  <Text color="$leafGreen9">•</Text>
                  <Text flex={1}>{tip}</Text>
                </XStack>
              ))}
            </YStack>

            <YStack space="$2">
              <Text fontSize="$6" fontWeight="bold" color="$alertRed9">{t('plant.warnings')}</Text>
              {(i18n.language === 'es' ? plant.warningsES : plant.warnings).map((warning, i) => (
                <XStack key={i} space="$2" alignItems="flex-start">
                  <Text color="$alertRed9">•</Text>
                  <Text flex={1}>{warning}</Text>
                </XStack>
              ))}
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </>
  );
}
