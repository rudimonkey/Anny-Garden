import { create } from 'zustand';
import { Plant } from '@plantitas/types';
import { mockPlants } from '../data/mockData';

interface PlantState {
  plants: Plant[];
  filteredPlants: Plant[];
  paginatedPlants: Plant[];
  pinnedIds: string[];
  searchQuery: string;
  activeFilters: {
    habitat: string[];
    use: string[];
  };
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;

  setSearchQuery: (query: string) => void;
  toggleFilter: (type: 'habitat' | 'use', value: string) => void;
  togglePin: (slug: string) => void;
  isPinned: (slug: string) => boolean;
  setPage: (page: number) => void;
  applyFilters: () => void;
}

export const usePlantStore = create<PlantState>((set, get) => ({
  plants: mockPlants,
  filteredPlants: mockPlants,
  paginatedPlants: mockPlants.slice(0, 6),
  pinnedIds: [],
  searchQuery: '',
  activeFilters: {
    habitat: [],
    use: [],
  },
  currentPage: 1,
  itemsPerPage: 6,
  totalPages: Math.ceil(mockPlants.length / 6),

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().applyFilters();
  },

  toggleFilter: (type, value) => {
    const { activeFilters } = get();
    const currentFilters = activeFilters[type];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter((f) => f !== value)
      : [...currentFilters, value];

    set({
      activeFilters: {
        ...activeFilters,
        [type]: newFilters,
      },
      currentPage: 1,
    });
    get().applyFilters();
  },

  togglePin: (slug) => {
    const { pinnedIds } = get();
    const newPinnedIds = pinnedIds.includes(slug)
      ? pinnedIds.filter((id) => id !== slug)
      : [...pinnedIds, slug];
    set({ pinnedIds: newPinnedIds });
  },

  isPinned: (slug) => {
    return get().pinnedIds.includes(slug);
  },

  setPage: (page) => {
    set({ currentPage: page });
    get().applyPagination();
  },

  applyFilters: () => {
    const { plants, searchQuery, activeFilters } = get();
    let filtered = [...plants];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.commonName.toLowerCase().includes(q) ||
          p.scientificName.toLowerCase().includes(q) ||
          p.labelES.toLowerCase().includes(q) ||
          p.labelEN.toLowerCase().includes(q)
      );
    }

    if (activeFilters.habitat.length > 0) {
      filtered = filtered.filter((p) =>
        p.facets.habitat.some((h) => activeFilters.habitat.includes(h))
      );
    }

    if (activeFilters.use.length > 0) {
      filtered = filtered.filter((p) =>
        p.facets.use.some((u) => activeFilters.use.includes(u))
      );
    }

    const { itemsPerPage } = get();
    set({
      filteredPlants: filtered,
      totalPages: Math.max(1, Math.ceil(filtered.length / itemsPerPage))
    });
    get().applyPagination();
  },

  applyPagination: () => {
    const { filteredPlants, currentPage, itemsPerPage } = get();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    set({ paginatedPlants: filteredPlants.slice(start, end) });
  }
}));
