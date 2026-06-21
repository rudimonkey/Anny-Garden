"use client";
import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export interface PlantCardProps {
  plant: any;
  onPinPress?: () => void;
  isPinned?: boolean;
}

export const PlantCard = ({ plant, onPinPress, isPinned }: PlantCardProps) => {
  const { i18n, t } = useTranslation();
  const primaryImage = plant.images.find((img: any) => img.isPrimary) || plant.images[0];
  const label = i18n.language === 'es' ? plant.labelES : plant.labelEN;

  return (
    <div className="relative group h-full">
      <Link href={"/plants/" + plant.slug} className="block h-full">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer h-full border border-gray-100 flex flex-col">
          <div className="p-8 pb-4 flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-3xl font-black text-[#1b4332] tracking-tighter leading-none mb-2">{label}</h3>
              <p className="text-sm text-gray-400 italic font-medium">{plant.scientificName}</p>
            </div>
            {plant.featured && (
              <span className="bg-[#e8f4fd] text-[#1b4332] text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shrink-0">
                ⭐ <span className="tracking-widest">DESTACADO</span>
              </span>
            )}
          </div>

          <div className="h-64 overflow-hidden bg-gray-50 mx-6 rounded-2xl">
            {primaryImage && (
              <img
                src={primaryImage.url}
                alt={label}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
            )}
          </div>

          <div className="p-8 mt-auto flex flex-wrap gap-2">
            {plant.facets.use.slice(0, 2).map((u: string) => (
              <span key={u} className="bg-[#a0522d] text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                {u}
              </span>
            ))}
            {plant.facets.habitat.slice(0, 1).map((h: string) => (
              <span key={h} className="bg-[#2d6a4f] text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                {h}
              </span>
            ))}
          </div>
        </div>
      </Link>
      {onPinPress && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPinPress();
          }}
          className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-lg z-10 flex items-center justify-center hover:bg-white transition-all transform hover:scale-110"
        >
          <span className="text-2xl">{isPinned ? '❤️' : '🤍'}</span>
        </button>
      )}
    </div>
  );
};
