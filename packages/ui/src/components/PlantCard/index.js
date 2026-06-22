import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { YStack, XStack, Text, Image, Card, H3, Paragraph } from 'tamagui';
import { FeaturedBadge } from '../FeaturedBadge';
import { Heart } from '@tamagui/lucide-icons';
export const PlantCard = ({ plant, language = 'es', isPinned, onPinPress, onPress }) => {
    const label = language === 'es' ? plant.labelES : plant.labelEN;
    const primaryImage = plant.images.find((img) => img.isPrimary) || plant.images[0];
    return (_jsxs(Card, { elevate: true, bordered: true, size: "$4", animation: "bouncy", hoverStyle: { scale: 0.98 }, pressStyle: { scale: 0.95 }, onPress: onPress, backgroundColor: "white", borderRadius: "$4", overflow: "hidden", width: "100%", maxWidth: 350, children: [_jsx(Card.Header, { padded: true, gap: "$2", children: _jsxs(XStack, { justifyContent: "space-between", alignItems: "flex-start", children: [_jsxs(YStack, { flex: 1, children: [_jsx(H3, { color: "$leafGreen11", numberOfLines: 1, size: "$6", fontWeight: "800", children: label }), _jsx(Paragraph, { color: "$gray10", fontStyle: "italic", size: "$2", numberOfLines: 1, children: plant.scientificName })] }), plant.featured && _jsx(FeaturedBadge, { label: language === 'es' ? 'Destacado' : 'Featured' })] }) }), _jsx(YStack, { height: 200, backgroundColor: "$gray2", marginHorizontal: "$4", borderRadius: "$3", overflow: "hidden", children: primaryImage && (_jsx(Image, { source: { uri: primaryImage.url, width: 400, height: 200 }, width: "100%", height: "100%", resizeMode: "cover" })) }), _jsx(Card.Footer, { padded: true, children: _jsxs(XStack, { gap: "$2", flexWrap: "wrap", children: [plant.facets.use.slice(0, 2).map((u) => (_jsx(XStack, { backgroundColor: "$soilBrown6", px: "$2", py: "$1", borderRadius: "$1", children: _jsx(Text, { color: "white", fontSize: 10, fontWeight: "800", children: u.toUpperCase() }) }, u))), plant.facets.habitat.slice(0, 1).map((h) => (_jsx(XStack, { backgroundColor: "$leafGreen9", px: "$2", py: "$1", borderRadius: "$1", children: _jsx(Text, { color: "white", fontSize: 10, fontWeight: "800", children: h.toUpperCase() }) }, h)))] }) }), onPinPress && (_jsx(XStack, { position: "absolute", top: "$2", right: "$2", onPress: (e) => {
                    e.stopPropagation();
                    onPinPress();
                }, backgroundColor: "white", padding: "$2", borderRadius: "$round", elevation: "$2", children: _jsx(Heart, { size: 18, color: isPinned ? '$alertRed9' : '$gray8', fill: isPinned ? '$alertRed9' : 'transparent' }) }))] }));
};
