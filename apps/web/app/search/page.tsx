"use client";
import React from 'react';
import { usePlantStore } from '@plantitas/core';
import { PlantCard } from '../../components/PlantCard';
import { useTranslation } from 'react-i18next';

export default function SearchPage() {
  const {
    searchQuery,
    setSearchQuery,
    paginatedPlants,
    activeFilters,
    toggleFilter,
    currentPage,
    totalPages,
    setPage,
    language
  } = usePlantStore();
  const { t } = useTranslation();

  const habitats = ['Exterior', 'Interior', 'Garden', 'Huerto'];
  const uses = ['Culinary', 'Medicinal', 'Aromatic', 'Ornamental'];

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-5xl font-black text-[#1b4332] mb-12 tracking-tighter">{t('nav.search', 'Buscar')}</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-black text-[#1b4332] mb-6 uppercase tracking-widest text-sm">{t('browse.categories', 'Categorías')}</h3>

            <div className="mb-8">
              <h4 className="font-extrabold text-[10px] text-[#2d6a4f] mb-4 uppercase tracking-widest">Habitat</h4>
              <div className="space-y-3">
                {habitats.map(h => (
                  <label key={h} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeFilters.habitat.includes(h)}
                      onChange={() => toggleFilter('habitat', h)}
                      className="w-5 h-5 rounded border-gray-300 text-[#2d6a4f] focus:ring-[#2d6a4f]"
                    />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-[#1b4332] transition-colors">{h}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-extrabold text-[10px] text-[#2d6a4f] mb-4 uppercase tracking-widest">Uso</h4>
              <div className="space-y-3">
                {uses.map(u => (
                  <label key={u} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeFilters.use.includes(u)}
                      onChange={() => toggleFilter('use', u)}
                      className="w-5 h-5 rounded border-gray-300 text-[#2d6a4f] focus:ring-[#2d6a4f]"
                    />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-[#1b4332] transition-colors">{u}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Search Area */}
        <div className="flex-1">
          <div className="flex gap-4 mb-12">
            <input
              type="text"
              placeholder={t('common.searchPlaceholder', 'Buscar...')}
              className="flex-1 bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 text-lg font-medium focus:border-[#2d6a4f] focus:outline-none shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#2d6a4f] text-white px-8 py-4 rounded-2xl font-black hover:bg-[#1b4332] transition-all shadow-lg">
              {t('common.search', 'Buscar')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {paginatedPlants.map(plant => (
              <div key={plant.slug} className="animate-in zoom-in-95 duration-500">
                <PlantCard plant={plant} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-4">
              <button
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-12 h-12 rounded-full border-2 border-[#2d6a4f] flex items-center justify-center text-[#2d6a4f] disabled:opacity-30 hover:bg-[#2d6a4f] hover:text-white transition-all font-bold"
              >
                ←
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-12 h-12 rounded-full font-black transition-all ${p === currentPage ? 'bg-[#2d6a4f] text-white shadow-lg' : 'bg-white text-[#1b4332] border-2 border-gray-100 hover:border-[#2d6a4f]'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-12 h-12 rounded-full border-2 border-[#2d6a4f] flex items-center justify-center text-[#2d6a4f] disabled:opacity-30 hover:bg-[#2d6a4f] hover:text-white transition-all font-bold"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
