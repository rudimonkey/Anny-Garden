import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Image, Text, YStack, XStack } from 'tamagui';
import React from 'react';
import { CategoryBadge } from '../CategoryBadge';
import { FeaturedBadge } from '../FeaturedBadge';
import { Heart } from '@tamagui/lucide-icons';
export const PlantCard = ({ plant, onPress, onPinPress, isPinned, locale = 'es' }) => {
    const primaryImage = plant.images.find(img => img.isPrimary) || plant.images[0];
    const label = locale === 'es' ? plant.labelES : plant.labelEN;
    return (_jsxs(Card, { elevate: true, bordered: true, width: 280, height: 350, onPress: onPress, animation: "bouncy", hoverStyle: { scale: 0.98 }, pressStyle: { scale: 0.95 }, children: [_jsx(Card.Header, { padded: true, children: _jsxs(XStack, { justifyContent: "space-between", alignItems: "flex-start", children: [_jsxs(YStack, { flex: 1, children: [_jsx(Text, { fontWeight: "bold", fontSize: "$4", numberOfLines: 1, children: label }), _jsx(Text, { fontSize: "$2", fontStyle: "italic", color: "$gray10", numberOfLines: 1, children: plant.scientificName })] }), _jsxs(XStack, { space: "$1", alignItems: "center", children: [plant.featured && _jsx(FeaturedBadge, { locale: locale }), onPinPress && (_jsx(Heart, { size: 16, fill: isPinned ? "$alertRed9" : "none", color: isPinned ? "$alertRed9" : "$gray8", onPress: (e) => {
                                        e.stopPropagation();
                                        onPinPress();
                                    } }))] })] }) }), _jsx(YStack, { flex: 1, padding: "$2", alignItems: "center", justifyContent: "center", children: primaryImage && (_jsx(Image, { source: { uri: primaryImage.url, width: 200, height: 150 }, width: 240, height: 180, borderRadius: "$2", objectFit: "cover" })) }), _jsx(Card.Footer, { padded: true, children: _jsxs(XStack, { space: "$2", flexWrap: "wrap", children: [plant.facets.use.slice(0, 2).map(u => (_jsx(CategoryBadge, { label: u, type: "use" }, u))), plant.facets.habitat.slice(0, 1).map(h => (_jsx(CategoryBadge, { label: h, type: "habitat" }, h)))] }) }), _jsx(Card.Background, {})] }));
};
