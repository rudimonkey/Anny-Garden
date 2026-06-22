import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ScrollView, YStack, Text } from 'tamagui';
import { usePlantStore } from '@plantitas/core';
import { PlantCard } from '@plantitas/ui';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
export default function CollectionScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { plants, pinnedIds } = usePlantStore();
    const pinnedPlants = plants.filter(p => pinnedIds.includes(p.slug));
    return (_jsx(ScrollView, { backgroundColor: "$leafGreen1", children: _jsxs(YStack, { padding: "$4", space: "$4", children: [_jsxs(YStack, { space: "$2", children: [_jsx(Text, { fontSize: "$8", fontWeight: "bold", color: "$leafGreen11", children: t('nav.collection') }), _jsx(Text, { fontSize: "$4", color: "$gray10", children: i18n.language === 'es' ? 'Tus plantas favoritas guardadas.' : 'Your saved favorite plants.' })] }), _jsx(YStack, { space: "$4", alignItems: "center", children: pinnedPlants.length > 0 ? (pinnedPlants.map((plant) => (_jsx(PlantCard, { plant: plant, locale: i18n.language, onPress: () => router.push(`/plants/${plant.slug}`) }, plant.id)))) : (_jsx(YStack, { padding: "$10", alignItems: "center", space: "$4", children: _jsx(Text, { color: "$gray10", fontSize: "$5", children: "No tienes plantas guardadas a\u00FAn." }) })) })] }) }));
}
