import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { YStack, Skeleton } from 'tamagui';
import React from 'react';
export const LoadingShimmer = ({ width = "100%", height = 200 }) => {
    return (_jsxs(YStack, { width: width, height: height, space: "$2", children: [_jsx(Skeleton, { width: "100%", height: "70%", borderRadius: "$4" }), _jsx(Skeleton, { width: "60%", height: "10%", borderRadius: "$2" }), _jsx(Skeleton, { width: "40%", height: "10%", borderRadius: "$2" })] }));
};
