import React from 'react'
import { YStack, XStack, Text, Image, Card, H3, Paragraph } from 'tamagui'
import { FeaturedBadge } from '../FeaturedBadge'
import { Heart } from '@tamagui/lucide-icons'

export interface PlantCardProps {
  plant: any
  language?: 'es' | 'en'
  isPinned?: boolean
  onPinPress?: () => void
  onPress?: () => void
}

export const PlantCard = ({ plant, language = 'es', isPinned, onPinPress, onPress }: PlantCardProps) => {
  const label = language === 'es' ? plant.labelES : plant.labelEN
  const primaryImage = plant.images.find((img: any) => img.isPrimary) || plant.images[0]

  return (
    <Card
      elevate
      bordered
      size="$4"
      animation="bouncy"
      hoverStyle={{ scale: 0.98 }}
      pressStyle={{ scale: 0.95 }}
      onPress={onPress}
      backgroundColor="white"
      borderRadius="$4"
      overflow="hidden"
      width="100%"
      maxWidth={350}
    >
      <Card.Header padded gap="$2">
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1}>
            <H3 color="$leafGreen11" numberOfLines={1} size="$6" fontWeight="800">
              {label}
            </H3>
            <Paragraph color="$gray10" fontStyle="italic" size="$2" numberOfLines={1}>
              {plant.scientificName}
            </Paragraph>
          </YStack>
          {plant.featured && <FeaturedBadge label={language === 'es' ? 'Destacado' : 'Featured'} />}
        </XStack>
      </Card.Header>

      <YStack height={200} backgroundColor="$gray2" marginHorizontal="$4" borderRadius="$3" overflow="hidden">
        {primaryImage && (
          <Image
            source={{ uri: primaryImage.url, width: 400, height: 200 }}
            width="100%"
            height="100%"
            resizeMode="cover"
          />
        )}
      </YStack>

      <Card.Footer padded>
        <XStack gap="$2" flexWrap="wrap">
          {plant.facets.use.slice(0, 2).map((u: string) => (
            <XStack key={u} backgroundColor="$soilBrown6" px="$2" py="$1" borderRadius="$1">
              <Text color="white" fontSize={10} fontWeight="800">
                {u.toUpperCase()}
              </Text>
            </XStack>
          ))}
          {plant.facets.habitat.slice(0, 1).map((h: string) => (
            <XStack key={h} backgroundColor="$leafGreen9" px="$2" py="$1" borderRadius="$1">
              <Text color="white" fontSize={10} fontWeight="800">
                {h.toUpperCase()}
              </Text>
            </XStack>
          ))}
        </XStack>
      </Card.Footer>

      {onPinPress && (
        <XStack
          position="absolute"
          top="$2"
          right="$2"
          onPress={(e) => {
            e.stopPropagation()
            onPinPress()
          }}
          backgroundColor="white"
          padding="$2"
          borderRadius="$round"
          elevation="$2"
        >
          <Heart size={18} color={isPinned ? '$alertRed9' : '$gray8'} fill={isPinned ? '$alertRed9' : 'transparent'} />
        </XStack>
      )}
    </Card>
  )
}
