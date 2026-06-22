import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Text, XStack } from 'tamagui';
import { Info, AlertCircle } from '@tamagui/lucide-icons';
export const Toast = ({ message, type = 'info' }) => (_jsxs(XStack, { backgroundColor: type === 'error' ? '$alertRed9' : '$leafGreen11', px: "$4", py: "$3", borderRadius: "$4", alignItems: "center", gap: "$3", elevation: "$4", animation: "quick", enterStyle: { opacity: 0, scale: 0.9, y: 20 }, children: [type === 'error' ? _jsx(AlertCircle, { color: "white" }) : _jsx(Info, { color: "white" }), _jsx(Text, { color: "white", fontWeight: "600", children: message })] }));
