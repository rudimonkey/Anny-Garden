import { jsx as _jsx } from "react/jsx-runtime";
import { Text, XStack } from 'tamagui';
import React from 'react';
export const CategoryBadge = ({ label, type = 'use' }) => {
    const getBadgeColor = () => {
        switch (type) {
            case 'habitat': return '$leafGreen9';
            case 'use': return '$soilBrown6';
            case 'difficulty': return '$alertRed9';
            case 'pollinator': return '$morningSky1';
            default: return '$leafGreen9';
        }
    };
    return (_jsx(XStack, { backgroundColor: getBadgeColor(), paddingHorizontal: "$2", paddingVertical: "$1", borderRadius: "$1", children: _jsx(Text, { color: "white", fontSize: "$1", fontWeight: "bold", children: label }) }));
};
