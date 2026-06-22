import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Stack } from 'expo-router';
import { TamaguiProvider, Theme } from 'tamagui';
import { config } from '@plantitas/ui';
import { initI18n } from '@plantitas/core';
import { initReactI18next } from 'react-i18next';
import { useEffect } from 'react';
import { ToastProvider, ToastViewport } from '@tamagui/toast';
export default function RootLayout() {
    useEffect(() => {
        initI18n('es', initReactI18next);
    }, []);
    return (_jsx(TamaguiProvider, { config: config, children: _jsx(Theme, { name: "light", children: _jsxs(ToastProvider, { children: [_jsxs(Stack, { children: [_jsx(Stack.Screen, { name: "(tabs)", options: { headerShown: false } }), _jsx(Stack.Screen, { name: "plants/[slug]", options: { title: 'Detalle de Planta' } })] }), _jsx(ToastViewport, { top: "$8", left: 0, right: 0 })] }) }) }));
}
