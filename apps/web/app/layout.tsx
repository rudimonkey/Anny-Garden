"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import './globals.css';
import { initI18n } from '@plantitas/core';
import { initReactI18next, useTranslation } from 'react-i18next';

initI18n('es', initReactI18next);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLng);
  };

  return (
    <html lang={i18n.language}>
      <body className="min-h-screen bg-leafGreen1">
        <header className="bg-leafGreen9 text-white shadow-md">
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">Plantitas</Link>
            <ul className="flex space-x-6 items-center">
              <li><Link href="/" className="hover:underline">{t('nav.home')}</Link></li>
              <li><Link href="/search" className="hover:underline">{t('nav.search')}</Link></li>
              <li><Link href="/admin" className="hover:underline text-morningSky1">{t('nav.admin')}</Link></li>
              <li>
                <button
                  onClick={toggleLanguage}
                  className="bg-white text-leafGreen9 px-2 py-1 rounded text-sm font-bold uppercase"
                >
                  {i18n.language === 'es' ? 'en' : 'es'}
                </button>
              </li>
            </ul>
          </nav>
        </header>
        {children}
        <footer className="bg-leafGreen11 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2026 Anny's Plantitas. San José, Costa Rica.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
