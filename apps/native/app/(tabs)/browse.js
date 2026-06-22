import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ScrollView, YStack, Text, XStack, Button } from 'tamagui';
import { usePlantStore, useUIStore } from '@plantitas/core';
import { PlantCard, SearchBar, Pagination, LoadingShimmer, OfflineBadge, ErrorBoundaryFallback } from '@plantitas/ui';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useToastController } from '@tamagui/toast';
export default function BrowseScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { paginatedPlants, searchQuery, setSearchQuery, activeFilters, toggleFilter, currentPage, totalPages, setPage, togglePin, isPinned } = usePlantStore();
    const { isLoading, isOffline, error, setError } = useUIStore();
    const toast = useToastController();
    const habitats = ['exterior', 'interior', 'garden', 'huerto'];
    const uses = ['culinary', 'medicinal', 'aromatic', 'ornamental'];
    if (error) {
        return (_jsx(ErrorBoundaryFallback, { error: new Error(error), resetErrorBoundary: () => setError(null) }));
    }
    const handlePin = (plant) => {
        togglePin(plant.slug);
        const pinned = isPinned(plant.slug);
        toast.show(pinned ? 'Eliminado de favoritos' : 'Añadido a favoritos', {
            type: pinned ? 'info' : 'success'
        });
    };
    return (_jsxs(YStack, { flex: 1, backgroundColor: "$leafGreen1", children: [_jsxs(YStack, { padding: "$4", space: "$4", children: [_jsxs(XStack, { justifyContent: "space-between", alignItems: "center", space: "$2", children: [_jsx(SearchBar, { flex: 1, value: searchQuery, onChangeText: setSearchQuery, placeholder: t('common.search') + "..." }), isOffline && _jsx(OfflineBadge, {})] }), _jsxs(YStack, { space: "$2", children: [_jsx(Text, { fontSize: "$4", fontWeight: "bold", color: "$gray11", children: "Habitat" }), _jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, children: _jsx(XStack, { space: "$2", children: habitats.map(h => (_jsx(Button, { size: "$2", theme: activeFilters.habitat.includes(h) ? 'green' : null, backgroundColor: activeFilters.habitat.includes(h) ? '$leafGreen9' : '$white', color: activeFilters.habitat.includes(h) ? 'white' : '$leafGreen11', onPress: () => toggleFilter('habitat', h), children: h }, h))) }) })] }), _jsxs(YStack, { space: "$2", children: [_jsx(Text, { fontSize: "$4", fontWeight: "bold", color: "$gray11", children: "Uso" }), _jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, children: _jsx(XStack, { space: "$2", children: uses.map(u => (_jsx(Button, { size: "$2", theme: activeFilters.use.includes(u) ? 'green' : null, backgroundColor: activeFilters.use.includes(u) ? '$leafGreen9' : '$white', color: activeFilters.use.includes(u) ? 'white' : '$leafGreen11', onPress: () => toggleFilter('use', u), children: u }, u))) }) })] })] }), _jsx(ScrollView, { contentContainerStyle: { paddingBottom: 40 }, children: _jsx(YStack, { space: "$4", alignItems: "center", padding: "$4", children: isLoading ? (_jsx(YStack, { space: "$4", width: "100%", alignItems: "center", children: [...Array(3)].map((_, i) => (_jsx(LoadingShimmer, { width: 280, height: 350 }, i))) })) : paginatedPlants.length > 0 ? (_jsxs(_Fragment, { children: [paginatedPlants.map((plant) => (_jsx(PlantCard, { plant: plant, locale: i18n.language, onPress: () => router.push(`/plants/${plant.slug}`), onPinPress: () => handlePin(plant), isPinned: isPinned(plant.slug) }, plant.id))), _jsx(Pagination, { currentPage: currentPage, totalPages: totalPages, onPageChange: setPage })] })) : (_jsxs(YStack, { padding: "$10", alignItems: "center", space: "$4", children: [_jsx(Text, { color: "$gray10", fontSize: "$5", children: t('common.noResults') }), _jsx(Button, { onPress: () => setSearchQuery(''), children: "Limpiar b\u00FAsqueda" })] })) }) })] }));
}
