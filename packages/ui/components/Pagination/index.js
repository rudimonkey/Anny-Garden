import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { XStack, Button, Text } from 'tamagui';
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons';
import React from 'react';
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (_jsxs(XStack, { space: "$2", alignItems: "center", justifyContent: "center", padding: "$4", children: [_jsx(Button, { icon: ChevronLeft, disabled: currentPage === 1, onPress: () => onPageChange(currentPage - 1), circular: true }), _jsxs(Text, { fontWeight: "bold", children: [currentPage, " / ", totalPages] }), _jsx(Button, { icon: ChevronRight, disabled: currentPage === totalPages, onPress: () => onPageChange(currentPage + 1), circular: true })] }));
};
