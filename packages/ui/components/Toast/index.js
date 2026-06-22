import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Toast as TamaguiToast, YStack } from 'tamagui';
import React from 'react';
export const Toast = ({ title, description, type = 'info' }) => {
    const getBackgroundColor = () => {
        switch (type) {
            case 'success': return '$leafGreen9';
            case 'error': return '$alertRed9';
            default: return '$morningSky1';
        }
    };
    const getTextColor = () => {
        return type === 'info' ? '$leafGreen11' : 'white';
    };
    return (_jsx(TamaguiToast, { enterStyle: { opacity: 0, scale: 0.5, y: -25 }, exitStyle: { opacity: 0, scale: 1, y: -20 }, y: 0, opacity: 1, scale: 1, animation: "quick", backgroundColor: getBackgroundColor(), borderRadius: "$4", padding: "$3", children: _jsxs(YStack, { children: [_jsx(TamaguiToast.Title, { color: getTextColor(), fontWeight: "bold", children: title }), description && (_jsx(TamaguiToast.Description, { color: getTextColor(), children: description }))] }) }));
};
