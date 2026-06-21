"use client";
import React, { useEffect } from "react";
import "./globals.css";
import { usePlantStore, initI18n } from "@plantitas/core";
import { initReactI18next, useTranslation } from "react-i18next";
import Link from "next/link";

// Initialize i18n immediately if in browser
if (typeof window !== 'undefined') {
  initI18n('es', initReactI18next);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-[#f0f7ee] text-[#1b4332] min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  const { language, toggleLanguage } = usePlantStore();
  const { t } = useTranslation();

  return (
    <header className="bg-[#1b4332] text-white py-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-black tracking-tighter cursor-pointer">Plantitas</h1>
        </Link>
        <nav className="flex gap-6 items-center font-bold">
          <Link href="/" className="hover:text-[#2d6a4f] transition-colors">{t('nav.home', 'Inicio')}</Link>
          <Link href="/search" className="hover:text-[#2d6a4f] transition-colors">{t('nav.search', 'Buscar')}</Link>
          <Link href="/admin" className="hover:text-[#2d6a4f] transition-colors">{t('nav.admin', 'Admin')}</Link>
          <button
            onClick={toggleLanguage}
            className="bg-white text-[#1b4332] px-3 py-1 rounded-full text-xs font-black hover:bg-[#f0f7ee] transition-all"
          >
            {language.toUpperCase()}
          </button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#1b4332] text-white py-8 mt-12">
      <div className="container mx-auto px-6 text-center">
        <p className="font-medium">© 2026 Anny's Plantitas. San José, Costa Rica.</p>
      </div>
    </footer>
  );
}
