import { Card, Image, Text, YStack, XStack } from 'tamagui';
import React from 'react';
import { Plant } from '@plantitas/types';
import { CategoryBadge } from '../CategoryBadge';
import { FeaturedBadge } from '../FeaturedBadge';
import { Heart } from '@tamagui/lucide-icons';

export interface PlantCardProps {
  plant: Plant;
  onPress?: () => void;
  onPinPress?: () => void;
  isPinned?: boolean;
  locale?: 'es' | 'en';
}

export const PlantCard = ({ plant, onPress, onPinPress, isPinned, locale = 'es' }: PlantCardProps) => {
  const primaryImage = plant.images.find(img => img.isPrimary) || plant.images[0];
  const label = locale === 'es' ? plant.labelES : plant.labelEN;

  return (
    <Card
      elevate
      bordered
      width={280}
      height={350}
      onPress={onPress}
      animation="bouncy"
      hoverStyle={{ scale: 0.98 }}
      pressStyle={{ scale: 0.95 }}
    >
      <Card.Header padded>
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1}>
            <Text fontWeight="bold" fontSize="$4" numberOfLines={1}>{label}</Text>
            <Text fontSize="$2" fontStyle="italic" color="$gray10" numberOfLines={1}>{plant.scientificName}</Text>
          </YStack>
          <XStack space="$1" alignItems="center">
            {plant.featured && <FeaturedBadge locale={locale} />}
            {onPinPress && (
                <Heart
                    size={16}
                    fill={isPinned ? "$alertRed9" : "none"}
                    color={isPinned ? "$alertRed9" : "$gray8"}
                    onPress={(e) => {
                        e.stopPropagation();
                        onPinPress();
                    }}
                />
            )}
          </XStack>
        </XStack>
      </Card.Header>

      <YStack flex={1} padding="$2" alignItems="center" justifyContent="center">
        {primaryImage && (
          <Image
            source={{ uri: primaryImage.url, width: 200, height: 150 }}
            width={240}
            height={180}
            borderRadius="$2"
            objectFit="cover"
          />
        )}
      </YStack>

      <Card.Footer padded>
        <XStack space="$2" flexWrap="wrap">
          {plant.facets.use.slice(0, 2).map(u => (
            <CategoryBadge key={u} label={u} type="use" />
          ))}
          {plant.facets.habitat.slice(0, 1).map(h => (
            <CategoryBadge key={h} label={h} type="habitat" />
          ))}
        </XStack>
      </Card.Footer>

      <Card.Background>
        {/* Optional background element */}
      </Card.Background>
    </Card>
  );
};
