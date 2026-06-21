import { YStack, H1, H2, ScrollView, XStack, Text } from 'tamagui'
import { usePlantStore } from '@plantitas/core'
import { PlantCard } from '@plantitas/ui'
import { useRouter } from 'expo-router'

export default function HomeScreen() {
  const { plants } = usePlantStore()
  const router = useRouter()
  const featured = plants.filter(p => p.featured)

  return (
    <ScrollView backgroundColor="$leafGreen1">
      <YStack p="$5" gap="$6">
        <YStack>
          <Text color="$leafGreen9" fontWeight="900" letterSpacing={2} fontSize={12}>BIENVENIDO A</Text>
          <H1 color="$leafGreen11" fontWeight="900" size="$10" letterSpacing={-2}>Plantitas</H1>
        </YStack>

        <YStack gap="$4">
          <XStack justifyContent="space-between" alignItems="center">
            <H2 color="$leafGreen11" size="$7" fontWeight="800">Destacados</H2>
            <Text color="$leafGreen9" fontWeight="700">Ver más</Text>
          </XStack>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$4">
              {featured.map(plant => (
                <PlantCard
                  key={plant.slug}
                  plant={plant}
                  onPress={() => router.push(`/plants/${plant.slug}`)}
                />
              ))}
            </XStack>
          </ScrollView>
        </YStack>

        <YStack gap="$4">
          <H2 color="$leafGreen11" size="$7" fontWeight="800">Tu Jardín</H2>
          <YStack gap="$4">
             {plants.slice(0, 3).map(plant => (
               <PlantCard
                key={plant.slug}
                plant={plant}
                onPress={() => router.push(`/plants/${plant.slug}`)}
               />
             ))}
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
