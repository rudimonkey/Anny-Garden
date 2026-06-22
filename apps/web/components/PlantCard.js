"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
export const PlantCard = ({ plant, onPinPress, isPinned }) => {
    const { i18n, t } = useTranslation();
    const primaryImage = plant.images.find((img) => img.isPrimary) || plant.images[0];
    const label = i18n.language === 'es' ? plant.labelES : plant.labelEN;
    return (_jsxs("div", { className: "relative group h-full", children: [_jsx(Link, { href: "/plants/" + plant.slug, className: "block h-full", children: _jsxs("div", { className: "bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer h-full border border-gray-100 flex flex-col", children: [_jsxs("div", { className: "p-8 pb-4 flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-3xl font-black text-[#1b4332] tracking-tighter leading-none mb-2", children: label }), _jsx("p", { className: "text-sm text-gray-400 italic font-medium", children: plant.scientificName })] }), plant.featured && (_jsxs("span", { className: "bg-[#e8f4fd] text-[#1b4332] text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shrink-0", children: ["\u2B50 ", _jsx("span", { className: "tracking-widest", children: "DESTACADO" })] }))] }), _jsx("div", { className: "h-64 overflow-hidden bg-gray-50 mx-6 rounded-2xl", children: primaryImage && (_jsx("img", { src: primaryImage.url, alt: label, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" })) }), _jsxs("div", { className: "p-8 mt-auto flex flex-wrap gap-2", children: [plant.facets.use.slice(0, 2).map((u) => (_jsx("span", { className: "bg-[#a0522d] text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest", children: u }, u))), plant.facets.habitat.slice(0, 1).map((h) => (_jsx("span", { className: "bg-[#2d6a4f] text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest", children: h }, h)))] })] }) }), onPinPress && (_jsx("button", { onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onPinPress();
                }, className: "absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-lg z-10 flex items-center justify-center hover:bg-white transition-all transform hover:scale-110", children: _jsx("span", { className: "text-2xl", children: isPinned ? '❤️' : '🤍' }) }))] }));
};
