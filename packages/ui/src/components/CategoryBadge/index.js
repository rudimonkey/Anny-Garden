import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { XStack, Text } from 'tamagui';
export const CategoryBadge = ({ label, color = '$leafGreen9' }) => (_jsx(XStack, { backgroundColor: color, px: "$2", py: "$1", borderRadius: "$1", children: _jsx(Text, { color: "white", fontSize: 10, fontWeight: "800", children: label.toUpperCase() }) }));
