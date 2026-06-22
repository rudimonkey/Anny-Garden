"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./globals.css";
import { usePlantStore, initI18n } from "@plantitas/core";
import { initReactI18next, useTranslation } from "react-i18next";
import Link from "next/link";
// Initialize i18n immediately if in browser
if (typeof window !== 'undefined') {
    initI18n('es', initReactI18next);
}
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "es", children: _jsxs("body", { className: "bg-[#f0f7ee] text-[#1b4332] min-h-screen flex flex-col font-sans", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1", children: children }), _jsx(Footer, {})] }) }));
}
function Header() {
    const { language, toggleLanguage } = usePlantStore();
    const { t } = useTranslation();
    return (_jsx("header", { className: "bg-[#1b4332] text-white py-4 shadow-lg sticky top-0 z-50", children: _jsxs("div", { className: "container mx-auto px-6 flex justify-between items-center", children: [_jsx(Link, { href: "/", children: _jsx("h1", { className: "text-2xl font-black tracking-tighter cursor-pointer", children: "Plantitas" }) }), _jsxs("nav", { className: "flex gap-6 items-center font-bold", children: [_jsx(Link, { href: "/", className: "hover:text-[#2d6a4f] transition-colors", children: t('nav.home', 'Inicio') }), _jsx(Link, { href: "/search", className: "hover:text-[#2d6a4f] transition-colors", children: t('nav.search', 'Buscar') }), _jsx(Link, { href: "/admin", className: "hover:text-[#2d6a4f] transition-colors", children: t('nav.admin', 'Admin') }), _jsx("button", { onClick: toggleLanguage, className: "bg-white text-[#1b4332] px-3 py-1 rounded-full text-xs font-black hover:bg-[#f0f7ee] transition-all", children: language.toUpperCase() })] })] }) }));
}
function Footer() {
    return (_jsx("footer", { className: "bg-[#1b4332] text-white py-8 mt-12", children: _jsx("div", { className: "container mx-auto px-6 text-center", children: _jsx("p", { className: "font-medium", children: "\u00A9 2026 Anny's Plantitas. San Jos\u00E9, Costa Rica." }) }) }));
}
