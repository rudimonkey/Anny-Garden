import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { YStack, H1, H2, ScrollView, XStack, Text } from 'tamagui';
import { usePlantStore } from '@plantitas/core';
import { PlantCard } from '@plantitas/ui';
import { useRouter } from 'expo-router';
export default function HomeScreen() {
    const { plants } = usePlantStore();
    const router = useRouter();
    const featured = plants.filter(p => p.featured);
    return (_jsx(ScrollView, { backgroundColor: "$leafGreen1", children: _jsxs(YStack, { p: "$5", gap: "$6", children: [_jsxs(YStack, { children: [_jsx(Text, { color: "$leafGreen9", fontWeight: "900", letterSpacing: 2, fontSize: 12, children: "BIENVENIDO A" }), _jsx(H1, { color: "$leafGreen11", fontWeight: "900", size: "$10", letterSpacing: -2, children: "Plantitas" })] }), _jsxs(YStack, { gap: "$4", children: [_jsxs(XStack, { justifyContent: "space-between", alignItems: "center", children: [_jsx(H2, { color: "$leafGreen11", size: "$7", fontWeight: "800", children: "Destacados" }), _jsx(Text, { color: "$leafGreen9", fontWeight: "700", children: "Ver m\u00E1s" })] }), _jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, children: _jsx(XStack, { gap: "$4", children: featured.map(plant => (_jsx(PlantCard, { plant: plant, onPress: () => router.push(`/plants/${plant.slug}`) }, plant.slug))) }) })] }), _jsxs(YStack, { gap: "$4", children: [_jsx(H2, { color: "$leafGreen11", size: "$7", fontWeight: "800", children: "Tu Jard\u00EDn" }), _jsx(YStack, { gap: "$4", children: plants.slice(0, 3).map(plant => (_jsx(PlantCard, { plant: plant, onPress: () => router.push(`/plants/${plant.slug}`) }, plant.slug))) })] })] }) }));
}
