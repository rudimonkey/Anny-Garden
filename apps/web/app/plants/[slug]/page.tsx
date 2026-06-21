"use client";
import React from 'react';
import { usePlantStore } from '@plantitas/core';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function PlantDetailPage() {
  const { slug } = useParams();
  const { plants, language } = usePlantStore();
  const { t } = useTranslation();
  const plant = plants.find(p => p.slug === slug);

  if (!plant) return <div className="p-20 text-center font-black text-3xl">Planta no encontrada.</div>;

  const primaryImage = plant.images.find(img => img.isPrimary) || plant.images[0];
  const label = language === 'es' ? plant.labelES : plant.labelEN;

  return (
    <div className="container mx-auto px-6 py-12 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Left: Image Gallery */}
        <div className="w-full lg:w-1/2">
           <div className="aspect-square bg-gray-50 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
             <img src={primaryImage.url} alt={label} className="w-full h-full object-cover" />
           </div>
           <div className="grid grid-cols-4 gap-4 mt-8">
              {plant.images.slice(0, 4).map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-md cursor-pointer hover:scale-105 transition-all">
                  <img src={img.url} className="w-full h-full object-cover" />
                </div>
              ))}
           </div>
        </div>

        {/* Right: Info */}
        <div className="w-full lg:w-1/2">
           <div className="mb-10">
              <span className="text-[#2d6a4f] font-black uppercase tracking-[0.3em] text-xs mb-4 block">
                {language === 'es' ? `Familia ${plant.botanicalFamily}` : `Family ${plant.botanicalFamily}`}
              </span>
              <h1 className="text-6xl md:text-8xl font-black text-[#1b4332] mb-4 tracking-tighter">{label}</h1>
              <p className="text-2xl italic text-gray-400 font-medium">{plant.scientificName}</p>
           </div>

           <div className="flex flex-wrap gap-3 mb-12">
              {plant.facets.habitat.map(h => (
                <span key={h} className="bg-[#2d6a4f] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{h}</span>
              ))}
              {plant.facets.use.map(u => (
                <span key={u} className="bg-[#a0522d] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{u}</span>
              ))}
           </div>

           <div className="prose prose-xl text-[#1b4332] opacity-80 mb-12 leading-relaxed font-medium">
              {language === 'es'
                ? `Aprende cómo cultivar y cuidar ${plant.commonName} (${plant.labelES}) en Costa Rica.`
                : `Learn how to grow and care for ${plant.commonName} (${plant.labelEN}) in Costa Rica.`}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-black mb-6 text-[#1b4332]">{t('care.tips', 'Consejos de cuidado')}</h3>
                <ul className="space-y-4">
                  {(language === 'es' ? plant.careTipsES : plant.careTips).map((tip, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className="text-[#2d6a4f] text-xl">•</span>
                      <span className="font-bold text-gray-600 leading-snug">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-6 text-[#c0392b]">{t('care.warnings', 'Advertencias')}</h3>
                 <ul className="space-y-4">
                  {(language === 'es' ? plant.warningsES : plant.warnings).map((w, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className="text-[#c0392b] text-xl">•</span>
                      <span className="font-bold text-gray-600 leading-snug">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
           </div>

           <div className="mt-16 p-8 bg-white rounded-3xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-400 mb-1">{t('care.difficulty', 'Dificultad')}</p>
                <p className="text-xl font-black text-[#1b4332] uppercase tracking-wider">{plant.difficultyLevel}</p>
              </div>
              <button className="bg-[#1b4332] text-white px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl">
                {t('common.addToCollection', 'Añadir a mi colección')}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
