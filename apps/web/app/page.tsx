"use client";
import React from 'react';
import { usePlantStore } from '@plantitas/core';
import { PlantCard } from '../components/PlantCard';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();
  const { plants } = usePlantStore();

  const featuredPlants = plants.filter(p => p.featured);
  const otherPlants = plants.filter(p => !p.featured).slice(0, 6);

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-leafGreen11 mb-6">{t('plant.featured')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPlants.map(plant => (
            <PlantCard key={plant.slug} plant={plant} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-leafGreen11 mb-6">Explora nuestro catálogo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherPlants.map(plant => (
            <PlantCard key={plant.slug} plant={plant} />
          ))}
        </div>
      </section>
    </main>
  );
}
