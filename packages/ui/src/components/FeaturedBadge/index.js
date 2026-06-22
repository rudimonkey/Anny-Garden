import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { XStack, Text } from 'tamagui';
import { Star } from '@tamagui/lucide-icons';
export const FeaturedBadge = ({ label = 'DESTACADO' }) => (_jsxs(XStack, { backgroundColor: "$morningSky1", paddingHorizontal: "$2", paddingVertical: "$1", borderRadius: "$1", alignItems: "center", gap: "$1", children: [_jsx(Star, { size: 12, color: "$leafGreen11", fill: "$leafGreen11" }), _jsx(Text, { color: "$leafGreen11", fontSize: 10, fontWeight: "900", letterSpacing: 0.5, children: label.toUpperCase() })] }));
