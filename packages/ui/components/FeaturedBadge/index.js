import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { XStack, Text } from 'tamagui';
import { Star } from '@tamagui/lucide-icons';
import React from 'react';
export const FeaturedBadge = ({ locale = 'es' }) => {
    const label = locale === 'es' ? 'DESTACADO' : 'FEATURED';
    return (_jsxs(XStack, { backgroundColor: "$morningSky1", paddingHorizontal: "$2", paddingVertical: "$1", borderRadius: "$1", alignItems: "center", space: "$1", children: [_jsx(Star, { size: 12, color: "$leafGreen11" }), _jsx(Text, { color: "$leafGreen11", fontSize: "$1", fontWeight: "bold", children: label })] }));
};
