import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs } from 'expo-router';
import { TamaguiProvider, Theme } from 'tamagui';
import config from '../../packages/ui/tamagui.config';
import { Leaf, Search, Library } from '@tamagui/lucide-icons';
export default function Layout() {
    return (_jsx(TamaguiProvider, { config: config, defaultTheme: "light", children: _jsx(Theme, { name: "light", children: _jsxs(Tabs, { screenOptions: {
                    tabBarActiveTintColor: '#1b4332',
                    tabBarInactiveTintColor: '#9e9e9e',
                    tabBarStyle: {
                        backgroundColor: 'white',
                        borderTopWidth: 1,
                        borderTopColor: '#f0f7ee',
                        height: 60,
                        paddingBottom: 10,
                    },
                    headerStyle: {
                        backgroundColor: '#1b4332',
                    },
                    headerTintColor: 'white',
                    headerTitleStyle: {
                        fontWeight: '900',
                    },
                }, children: [_jsx(Tabs.Screen, { name: "index", options: {
                            title: 'Inicio',
                            tabBarIcon: ({ color }) => _jsx(Leaf, { color: color }),
                        } }), _jsx(Tabs.Screen, { name: "browse", options: {
                            title: 'Explorar',
                            tabBarIcon: ({ color }) => _jsx(Search, { color: color }),
                        } }), _jsx(Tabs.Screen, { name: "collection", options: {
                            title: 'Mi Huerto',
                            tabBarIcon: ({ color }) => _jsx(Library, { color: color }),
                        } })] }) }) }));
}
