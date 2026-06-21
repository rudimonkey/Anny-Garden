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
    <div className="relative group">
      <Link href={"/plants/" + plant.slug} className="block">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer h-full border border-gray-100">
          <div className="p-4 flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-leafGreen11 truncate pr-2">{label}</h3>
              <p className="text-sm text-gray-500 italic truncate">{plant.scientificName}</p>
            </div>
            {plant.featured && (
              <span className="bg-morningSky1 text-leafGreen11 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shrink-0">
                <span className="text-xs">⭐</span> {t('plant.featured').toUpperCase()}
              </span>
            )}
          </div>

          <div className="h-48 overflow-hidden bg-gray-100 mx-4 rounded-lg">
            {primaryImage && (
              <img
                src={primaryImage.url}
                alt={label}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="p-4 mt-auto">
            <div className="flex flex-wrap gap-2">
              {plant.facets.use.slice(0, 2).map((u: string) => (
                <span key={u} className="bg-soilBrown6 text-white text-[10px] font-bold px-2 py-1 rounded">
                  {u.toUpperCase()}
                </span>
              ))}
              {plant.facets.habitat.slice(0, 1).map((h: string) => (
                <span key={h} className="bg-leafGreen9 text-white text-[10px] font-bold px-2 py-1 rounded">
                  {h.toUpperCase()}
                </span>
              ))}
            </div>
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
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md z-10 hover:bg-white transition-colors"
        >
          {isPinned ? '❤️' : '🤍'}
        </button>
      )}
    </div>
  );
};
