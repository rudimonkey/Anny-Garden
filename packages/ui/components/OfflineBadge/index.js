import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { XStack, Text } from 'tamagui';
import { WifiOff } from '@tamagui/lucide-icons';
import React from 'react';
export const OfflineBadge = () => {
    return (_jsxs(XStack, { backgroundColor: "$guestGray5", paddingHorizontal: "$2", paddingVertical: "$1", borderRadius: "$1", alignItems: "center", space: "$1", children: [_jsx(WifiOff, { size: 12, color: "white" }), _jsx(Text, { color: "white", fontSize: "$1", fontWeight: "bold", children: "OFFLINE" })] }));
};
