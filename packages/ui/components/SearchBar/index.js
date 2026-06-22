import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input, XStack, Button } from 'tamagui';
import { Search } from '@tamagui/lucide-icons';
import React from 'react';
export const SearchBar = ({ value, onChangeText, placeholder = "Buscar plantas...", onSearch }) => {
    return (_jsxs(XStack, { space: "$2", alignItems: "center", width: "100%", children: [_jsx(Input, { flex: 1, size: "$4", value: value, onChangeText: onChangeText, placeholder: placeholder, borderWidth: 2, focusStyle: { borderColor: '$leafGreen9' } }), _jsx(Button, { size: "$4", icon: Search, onPress: onSearch, backgroundColor: "$leafGreen9", color: "white" })] }));
};
