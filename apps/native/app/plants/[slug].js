import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useLocalSearchParams, Stack } from 'expo-router';
import { ScrollView, YStack, XStack, Text, Image, Button } from 'tamagui';
import { getMockPlantBySlug, usePlantStore } from '@plantitas/core';
import { CategoryBadge } from '@plantitas/ui';
import { useTranslation } from 'react-i18next';
import { Heart } from '@tamagui/lucide-icons';
import { useToastController } from '@tamagui/toast';
export default function PlantDetailScreen() {
    const { t, i18n } = useTranslation();
    const { slug } = useLocalSearchParams();
    const { togglePin, isPinned } = usePlantStore();
    const plant = getMockPlantBySlug(slug);
    const toast = useToastController();
    if (!plant) {
        return (_jsx(YStack, { flex: 1, alignItems: "center", justifyContent: "center", children: _jsx(Text, { children: "Planta no encontrada" }) }));
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
    return (_jsxs(_Fragment, { children: [_jsx(Stack.Screen, { options: {
                    title: i18n.language === 'es' ? plant.labelES : plant.labelEN,
                    headerRight: () => (_jsx(Button, { chromeless: true, icon: _jsx(Heart, { fill: pinned ? "$alertRed9" : "none", color: pinned ? "$alertRed9" : "$gray10" }), onPress: handleTogglePin }))
                } }), _jsx(ScrollView, { backgroundColor: "white", children: _jsxs(YStack, { children: [primaryImage && (_jsx(Image, { source: { uri: primaryImage.url }, width: "100%", height: 300, objectFit: "cover" })), _jsxs(YStack, { padding: "$4", space: "$4", children: [_jsxs(YStack, { children: [_jsx(Text, { fontSize: "$9", fontWeight: "bold", color: "$leafGreen11", children: i18n.language === 'es' ? plant.labelES : plant.labelEN }), _jsx(Text, { fontSize: "$5", fontStyle: "italic", color: "$gray10", children: plant.scientificName })] }), _jsxs(XStack, { space: "$2", flexWrap: "wrap", children: [plant.facets.habitat.map(h => _jsx(CategoryBadge, { label: h, type: "habitat" }, h)), plant.facets.use.map(u => _jsx(CategoryBadge, { label: u, type: "use" }, u))] }), _jsxs(YStack, { space: "$2", backgroundColor: "$leafGreen1", padding: "$4", borderRadius: "$4", children: [_jsx(Text, { fontWeight: "bold", color: "$leafGreen11", children: i18n.language === 'es' ? 'Sobre esta planta' : 'About this plant' }), _jsx(Text, { color: "$gray11", children: plant.metaDescription })] }), _jsxs(YStack, { space: "$2", children: [_jsx(Text, { fontSize: "$6", fontWeight: "bold", color: "$leafGreen11", children: t('plant.tips') }), (i18n.language === 'es' ? plant.careTipsES : plant.careTips).map((tip, i) => (_jsxs(XStack, { space: "$2", alignItems: "flex-start", children: [_jsx(Text, { color: "$leafGreen9", children: "\u2022" }), _jsx(Text, { flex: 1, children: tip })] }, i)))] }), _jsxs(YStack, { space: "$2", children: [_jsx(Text, { fontSize: "$6", fontWeight: "bold", color: "$alertRed9", children: t('plant.warnings') }), (i18n.language === 'es' ? plant.warningsES : plant.warnings).map((warning, i) => (_jsxs(XStack, { space: "$2", alignItems: "flex-start", children: [_jsx(Text, { color: "$alertRed9", children: "\u2022" }), _jsx(Text, { flex: 1, children: warning })] }, i)))] })] })] }) })] }));
}
