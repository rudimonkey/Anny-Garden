"use client";
import React from 'react';
import { usePlantStore } from '@plantitas/core';
import { PlantCard } from '../components/PlantCard';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function HomePage() {
  const { plants, language } = usePlantStore();
  const { t } = useTranslation();

  const featuredPlants = plants.filter(p => p.featured);
  const otherPlants = plants.filter(p => !p.featured).slice(0, 6);

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-[#1b4332] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img
            src="https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="Hero background"
           />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            {language === 'es' ? 'Tu conexión vital con la naturaleza.' : 'Your vital connection with nature.'}
          </h1>
          <p className="text-xl md:text-2xl font-medium opacity-90 mb-8">
            {language === 'es' ? 'Catálogo botánico curado para el amante de las plantas en Costa Rica.' : 'Curated botanical catalog for the plant lover in Costa Rica.'}
          </p>
          <Link href="/search" className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-8 py-4 rounded-full text-lg font-bold transition-all inline-block shadow-xl">
            {t('common.explore', 'Explorar Catálogo')}
          </Link>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        {/* Featured Section */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-4xl font-black text-[#1b4332] tracking-tighter">{t('plant.featured', 'Plantas Destacadas')}</h2>
            <div className="h-[2px] flex-1 bg-[#2d6a4f] opacity-20"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredPlants.map(plant => (
              <PlantCard key={plant.slug} plant={plant} />
            ))}
          </div>
        </section>

        {/* Catalog Preview */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-4xl font-black text-[#1b4332] tracking-tighter">
              {language === 'es' ? 'Últimas Adiciones' : 'Latest Additions'}
            </h2>
            <div className="h-[2px] flex-1 bg-[#2d6a4f] opacity-20"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPlants.map(plant => (
              <PlantCard key={plant.slug} plant={plant} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/search" className="text-[#2d6a4f] font-black text-xl hover:underline">
               {language === 'es' ? 'Ver todo el catálogo →' : 'See full catalog →'}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
