"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const SearchBar = ({ value, onChangeText, placeholder = "Buscar plantas...", onSearch }) => {
    return (_jsxs("div", { className: "flex gap-2 w-full", children: [_jsx("input", { type: "text", value: value, onChange: (e) => onChangeText(e.target.value), placeholder: placeholder, className: "flex-1 px-4 py-2 border-2 border-gray-200 rounded-md focus:border-leafGreen9 focus:outline-none" }), _jsx("button", { onClick: onSearch, className: "px-4 py-2 bg-leafGreen9 text-white rounded-md hover:bg-leafGreen11 transition-colors", children: "Buscar" })] }));
};
