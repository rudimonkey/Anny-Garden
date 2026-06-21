"use client";
import React from 'react';
import { usePlantStore, getMockPlantBySlug, mockPlants } from '@plantitas/core';
import { notFound } from 'next/navigation';
import { useTranslation } from 'react-i18next';

// export function generateStaticParams() {
//   return mockPlants.map((plant) => ({
//     slug: plant.slug,
//   }));
// }

export default function PlantDetailPage({ params }: { params: { slug: string } }) {
  const { t, i18n } = useTranslation();
  const { togglePin, isPinned } = usePlantStore();
  const plant = getMockPlantBySlug(params.slug);

  if (!plant) {
    notFound();
  }

  const pinned = isPinned(plant.slug);
  const primaryImage = plant.images.find(img => img.isPrimary) || plant.images[0];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden relative">
        <button
          onClick={() => togglePin(plant.slug)}
          className={`absolute top-4 right-4 p-3 rounded-full shadow-md z-10 transition-colors ${pinned ? 'bg-alertRed9 text-white' : 'bg-white text-gray-400'}`}
        >
          {pinned ? '❤️' : '🤍'}
        </button>
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            {primaryImage && (
              <img
                className="h-96 w-full object-cover md:w-96"
                src={primaryImage.url}
                alt={plant.labelES}
              />
            )}
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-leafGreen9 font-semibold">
              {plant.botanicalFamily}
            </div>
            <h1 className="block mt-1 text-4xl leading-tight font-bold text-black">
              {i18n.language === 'es' ? plant.labelES : plant.labelEN}
            </h1>
            <p className="mt-2 text-gray-500 italic">{plant.scientificName}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {plant.facets.habitat.map(h => (
                <span key={h} className="bg-leafGreen9 text-white text-[10px] font-bold px-2 py-1 rounded">
                  {h.toUpperCase()}
                </span>
              ))}
              {plant.facets.use.map(u => (
                <span key={u} className="bg-soilBrown6 text-white text-[10px] font-bold px-2 py-1 rounded">
                  {u.toUpperCase()}
                </span>
              ))}
            </div>

            <p className="mt-6 text-gray-700">
              {plant.metaDescription}
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-leafGreen11 mb-2">{t('plant.tips')}</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {(i18n.language === 'es' ? plant.careTipsES : plant.careTips).map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-leafGreen11 mb-2">{t('plant.warnings')}</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {(i18n.language === 'es' ? plant.warningsES : plant.warnings).map((warning, i) => <li key={i}>{warning}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
