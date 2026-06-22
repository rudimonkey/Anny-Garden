import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { XStack, Button, Text } from 'tamagui';
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons';
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (_jsxs(XStack, { gap: "$2", alignItems: "center", justifyContent: "center", py: "$4", children: [_jsx(Button, { size: "$3", circular: true, icon: ChevronLeft, disabled: currentPage === 1, onPress: () => onPageChange(currentPage - 1), opacity: currentPage === 1 ? 0.3 : 1 }), pages.map((p) => (_jsx(Button, { size: "$3", circular: true, backgroundColor: p === currentPage ? '$leafGreen9' : 'transparent', onPress: () => onPageChange(p), children: _jsx(Text, { color: p === currentPage ? 'white' : '$leafGreen11', children: p }) }, p))), _jsx(Button, { size: "$3", circular: true, icon: ChevronRight, disabled: currentPage === totalPages, onPress: () => onPageChange(currentPage + 1), opacity: currentPage === totalPages ? 0.3 : 1 })] }));
};
