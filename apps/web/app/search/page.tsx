"use client";
import React, { useEffect, useState } from 'react';
import { usePlantStore, useUIStore } from '@plantitas/core';
import { PlantCard } from '../../components/PlantCard';
import { SearchBar } from '../../components/SearchBar';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const {
    paginatedPlants,
    setSearchQuery,
    activeFilters,
    toggleFilter,
    currentPage,
    totalPages,
    setPage,
    togglePin,
    isPinned
  } = usePlantStore();

  const { isOffline, isLoading, error, setError } = useUIStore();
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    setSearchQuery(query);
  }, [query, setSearchQuery]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSearch = (text: string) => {
    const params = new URLSearchParams(searchParams);
    if (text) {
      params.set('q', text);
    } else {
      params.delete('q');
    }
    router.push(`/search?${params.toString()}`);
  };

  const handlePin = (slug: string) => {
    togglePin(slug);
    const pinned = isPinned(slug);
    setShowToast(pinned ? 'Eliminado de favoritos' : 'Añadido a favoritos');
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-alertRed9 mb-4">Error</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <button onClick={() => setError(null)} className="bg-leafGreen9 text-white px-6 py-2 rounded">
          Reintentar
        </button>
      </div>
    );
  }

  const habitats = ['exterior', 'interior', 'garden', 'huerto'];
  const uses = ['culinary', 'medicinal', 'aromatic', 'ornamental'];

  return (
    <main className="container mx-auto px-4 py-8 relative">
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-leafGreen11 text-white px-6 py-3 rounded-lg shadow-2xl z-50 animate-bounce">
          {showToast}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-leafGreen11">{t('nav.search')}</h1>
        {isOffline && (
          <div className="flex items-center gap-2 bg-alertRed9 text-white px-4 py-1 rounded-full text-xs font-bold">
            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
            OFFLINE
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg mb-4 text-leafGreen11">{t('browse.categories')}</h2>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Habitat</h3>
              <div className="flex flex-col gap-2">
                {habitats.map(h => (
                  <label key={h} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.habitat.includes(h)}
                      onChange={() => toggleFilter('habitat', h)}
                      className="rounded text-leafGreen9 focus:ring-leafGreen9"
                    />
                    <span className="text-sm capitalize">{h}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Uso</h3>
              <div className="flex flex-col gap-2">
                {uses.map(u => (
                  <label key={u} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.use.includes(u)}
                      onChange={() => toggleFilter('use', u)}
                      className="rounded text-leafGreen9 focus:ring-leafGreen9"
                    />
                    <span className="text-sm capitalize">{u}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="mb-8">
            <SearchBar
              value={query}
              onChangeText={handleSearch}
              placeholder={t('common.search') + "..."}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse h-[350px] rounded-lg"></div>
              ))}
            </div>
          ) : paginatedPlants.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPlants.map(plant => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    isPinned={isPinned(plant.slug)}
                    onPinPress={() => handlePin(plant.slug)}
                  />
                ))}
              </div>

              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                  className="p-3 border rounded-full disabled:opacity-30 hover:bg-leafGreen1 transition-colors"
                >
                  ←
                </button>
                <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`w-10 h-10 rounded-full font-bold transition-colors ${currentPage === i + 1 ? 'bg-leafGreen9 text-white' : 'border hover:bg-leafGreen1'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(currentPage + 1)}
                  className="p-3 border rounded-full disabled:opacity-30 hover:bg-leafGreen1 transition-colors"
                >
                  →
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-xl text-gray-500">
                {t('common.noResults')} "{query}"
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
