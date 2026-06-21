import albahaca from './albahaca.json';
import aloeVera from './aloe-vera.json';
import monstera from './monstera.json';
import romero from './romero.json';
import tomate from './tomate.json';
import { Plant } from '@plantitas/types';

const basePlants: Plant[] = [
  albahaca as any,
  aloeVera as any,
  monstera as any,
  romero as any,
  tomate as any,
];

export const mockPlants: Plant[] = Array.from({ length: 25 }).map((_, i) => {
  const base = basePlants[i % basePlants.length];
  return {
    ...base,
    id: `${base.slug}-${i}`,
    slug: i < basePlants.length ? base.slug : `${base.slug}-${i}`,
    labelES: i < basePlants.length ? base.labelES : `${base.labelES} (${i + 1})`,
    labelEN: i < basePlants.length ? base.labelEN : `${base.labelEN} (${i + 1})`,
    featured: i % 7 === 0,
  };
});
