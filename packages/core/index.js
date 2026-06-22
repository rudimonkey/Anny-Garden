"use client";
import i18n from 'i18next';
import es from './locales/es.json';
import en from './locales/en.json';
export const initI18n = (locale = 'es', initReactI18next) => {
    const instance = i18n;
    if (initReactI18next) {
        instance.use(initReactI18next);
    }
    instance.init({
        resources: {
            es: { translation: es },
            en: { translation: en },
        },
        lng: locale,
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false,
        },
    });
    return i18n;
};
export { i18n };
// Mock Data
import { mockPlants } from './data/mockData';
export { mockPlants };
export const getMockPlantBySlug = (slug) => {
    return mockPlants.find((p) => p.slug === slug);
};
export * from './store/usePlantStore';
export * from './store/useUIStore';
