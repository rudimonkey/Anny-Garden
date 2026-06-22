import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { YStack, Text, Button } from 'tamagui';
import { AlertTriangle } from '@tamagui/lucide-icons';
import React from 'react';
export const ErrorBoundaryFallback = ({ error, resetErrorBoundary, message = "Algo salió mal" }) => {
    return (_jsxs(YStack, { padding: "$4", alignItems: "center", justifyContent: "center", space: "$4", flex: 1, children: [_jsx(AlertTriangle, { size: 48, color: "$alertRed9" }), _jsx(Text, { fontSize: "$6", fontWeight: "bold", textAlign: "center", children: message }), error && _jsx(Text, { color: "$gray10", textAlign: "center", children: error.message }), _jsx(Button, { onPress: resetErrorBoundary, backgroundColor: "$leafGreen9", color: "white", children: "Reintentar" })] }));
};
