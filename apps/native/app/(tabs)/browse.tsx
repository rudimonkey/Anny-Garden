import React from 'react';
import { ScrollView, YStack, Text, XStack, Button } from 'tamagui';
import { usePlantStore, useUIStore } from '@plantitas/core';
import { PlantCard, SearchBar, Pagination, LoadingShimmer, OfflineBadge, ErrorBoundaryFallback } from '@plantitas/ui';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useToastController } from '@tamagui/toast';

export default function BrowseScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const {
    paginatedPlants,
    searchQuery,
    setSearchQuery,
    activeFilters,
    toggleFilter,
    currentPage,
    totalPages,
    setPage,
    togglePin,
    isPinned
  } = usePlantStore();

  const { isLoading, isOffline, error, setError } = useUIStore();
  const toast = useToastController();

  const habitats = ['exterior', 'interior', 'garden', 'huerto'];
  const uses = ['culinary', 'medicinal', 'aromatic', 'ornamental'];

  if (error) {
    return (
      <ErrorBoundaryFallback
        error={new Error(error)}
        resetErrorBoundary={() => setError(null)}
      />
    );
  }

  const handlePin = (plant: any) => {
    togglePin(plant.slug);
    const pinned = isPinned(plant.slug);
    toast.show(pinned ? 'Eliminado de favoritos' : 'Añadido a favoritos', {
        type: pinned ? 'info' : 'success'
    });
  };

  return (
    <YStack flex={1} backgroundColor="$leafGreen1">
      <YStack padding="$4" space="$4">
        <XStack justifyContent="space-between" alignItems="center" space="$2">
          <SearchBar
            flex={1}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('common.search') + "..."}
          />
          {isOffline && <OfflineBadge />}
        </XStack>

        <YStack space="$2">
          <Text fontSize="$4" fontWeight="bold" color="$gray11">Habitat</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack space="$2">
              {habitats.map(h => (
                <Button
                  key={h}
                  size="$2"
                  theme={activeFilters.habitat.includes(h) ? 'green' : null}
                  backgroundColor={activeFilters.habitat.includes(h) ? '$leafGreen9' : '$white'}
                  color={activeFilters.habitat.includes(h) ? 'white' : '$leafGreen11'}
                  onPress={() => toggleFilter('habitat', h)}
                >
                  {h}
                </Button>
              ))}
            </XStack>
          </ScrollView>
        </YStack>

        <YStack space="$2">
          <Text fontSize="$4" fontWeight="bold" color="$gray11">Uso</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack space="$2">
              {uses.map(u => (
                <Button
                  key={u}
                  size="$2"
                  theme={activeFilters.use.includes(u) ? 'green' : null}
                  backgroundColor={activeFilters.use.includes(u) ? '$leafGreen9' : '$white'}
                  color={activeFilters.use.includes(u) ? 'white' : '$leafGreen11'}
                  onPress={() => toggleFilter('use', u)}
                >
                  {u}
                </Button>
              ))}
            </XStack>
          </ScrollView>
        </YStack>
      </YStack>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <YStack space="$4" alignItems="center" padding="$4">
          {isLoading ? (
            <YStack space="$4" width="100%" alignItems="center">
              {[...Array(3)].map((_, i) => (
                <LoadingShimmer key={i} width={280} height={350} />
              ))}
            </YStack>
          ) : paginatedPlants.length > 0 ? (
            <>
              {paginatedPlants.map((plant) => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  locale={i18n.language as any}
                  onPress={() => router.push(`/plants/${plant.slug}`)}
                  onPinPress={() => handlePin(plant)}
                  isPinned={isPinned(plant.slug)}
                />
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <YStack padding="$10" alignItems="center" space="$4">
              <Text color="$gray10" fontSize="$5">{t('common.noResults')}</Text>
              <Button onPress={() => setSearchQuery('')}>Limpiar búsqueda</Button>
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
