import { create } from 'zustand';
import { Plant } from '@plantitas/types';
import { mockPlants } from '../data/mockData';
import FlexSearch from 'flexsearch';
import i18n from 'i18next';

// Initialize FlexSearch index for fuzzy searching
const index = new FlexSearch.Document<any>({
  document: {
    id: "slug",
    index: ["commonName", "scientificName", "labelES", "labelEN"],
  },
  tokenize: "forward",
});

mockPlants.forEach((p) => index.add(p));

interface PlantState {
  plants: Plant[];
  filteredPlants: Plant[];
  paginatedPlants: Plant[];
  pinnedIds: string[];
  searchQuery: string;
  language: 'es' | 'en';
  activeFilters: {
    habitat: string[];
    use: string[];
  };
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;

  setSearchQuery: (query: string) => void;
  setLanguage: (lang: 'es' | 'en') => void;
  toggleLanguage: () => void;
  toggleFilter: (type: 'habitat' | 'use', value: string) => void;
  togglePin: (slug: string) => void;
  isPinned: (slug: string) => boolean;
  setPage: (page: number) => void;
  applyFilters: () => void;
  applyPagination: () => void;
}

export const usePlantStore = create<PlantState>((set, get) => ({
  plants: mockPlants,
  filteredPlants: mockPlants,
  paginatedPlants: mockPlants.slice(0, 6),
  pinnedIds: [],
  searchQuery: '',
  language: 'es',
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

  setLanguage: (lang) => {
    set({ language: lang });
    i18n.changeLanguage(lang);
  },

  toggleLanguage: () => {
    const nextLang = get().language === 'es' ? 'en' : 'es';
    get().setLanguage(nextLang);
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
    let filtered: Plant[] = [];

    if (searchQuery) {
      // Use FlexSearch for fuzzy matching
      const results = index.search(searchQuery, { enrich: true });
      // Flatten FlexSearch results
      const foundSlugs = new Set();
      results.forEach((r: any) => r.result.forEach((slug: string) => foundSlugs.add(slug)));
      filtered = plants.filter(p => foundSlugs.has(p.slug));
    } else {
      filtered = [...plants];
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
