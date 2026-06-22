import { z } from 'zod';

export const PlantFacetSchema = z.object({
  habitat: z.array(z.string()),
  growthHabit: z.array(z.string()),
  use: z.array(z.string()),
  difficulty: z.array(z.string()),
  pollinator: z.array(z.string()),
  companion: z.boolean(),
  maintenance: z.array(z.string()),
});

export const PlantImageSchema = z.object({
  _id: z.string().optional(),
  url: z.string().url(),
  width: z.number(),
  height: z.number(),
  caption: z.string().optional(),
  isPrimary: z.boolean(),
  attribution: z.string().optional(),
  uploadedAt: z.union([z.date(), z.string().datetime()]).optional(),
  altText: z.string().optional(),
});

export const PhenologyRecordSchema = z.object({
  stage: z.string(),
  startMonth: z.string(),
  endMonth: z.string(),
  crSpecific: z.boolean(),
});

export const CompanionPlantSchema = z.object({
  slug: z.string(),
  benefit: z.string(),
  benefitES: z.string(),
  notes: z.string().optional(),
  notesES: z.string().optional(),
});

export const PollinatorValueSchema = z.object({
  attracts: z.array(z.string()),
  nectarRating: z.string(),
  specificNotes: z.string().optional(),
  specificNotesES: z.string().optional(),
});

export const HarvestInfoSchema = z.object({
  firstHarvestDays: z.number(),
  daysToMaturity: z.number(),
  yieldPerPlant: z.string(),
  yieldPerPlantES: z.string(),
  expectedYieldPerSqMeter: z.string(),
  frequency: z.string(),
  frequencyES: z.string(),
  edibleParts: z.array(z.string()),
  ediblePartsES: z.array(z.string()),
});

export const CulinaryUseSchema = z.object({
  part: z.string(),
  recipes: z.array(z.string()),
  tips: z.array(z.string()),
});

export const CommonPestSchema = z.object({
  name: z.string(),
  nameES: z.string(),
  symptoms: z.string(),
  symptomsES: z.string(),
  organicControls: z.array(z.string()),
  organicControlsES: z.array(z.string()),
});

export const SoilPreferencesSchema = z.object({
  phRange: z.string(),
  preferredType: z.string(),
  nutrientNotes: z.string(),
  nutrientNotesES: z.string(),
});

export const ClimateSuitabilitySchema = z.object({
  heatTolerance: z.string(),
  frostSensitivity: z.string(),
  drought: z.string(),
  rainfallPreference: z.string(),
  windTolerance: z.string(),
  heatToleranceES: z.string(),
  frostSensitivityES: z.string(),
  droughtES: z.string(),
  rainfallPreferenceES: z.string(),
  windToleranceES: z.string(),
});

export const RegionalAdaptationSchema = z.object({
  region: z.string(),
  adaptation: z.string(),
  notes: z.string(),
});

export const ExternalIdsSchema = z.object({
  GBIF: z.string().optional(),
  POWO: z.string().optional(),
  IPNI: z.string().optional(),
  Wikidata: z.string().optional(),
  Trefle: z.string().optional(),
  Perenual: z.string().optional(),
  USDA: z.string().optional(),
  iNaturalist: z.string().optional(),
});

export const ChangeLogEntrySchema = z.object({
  date: z.union([z.date(), z.string().datetime()]),
  changes: z.record(z.any()),
  updatedBy: z.string(),
});

export const PlantSchema = z.object({
  _id: z.string().optional(),
  slug: z.string(),
  commonName: z.string(),
  scientificName: z.string(),
  botanicalFamily: z.string(),
  labelES: z.string(),
  labelEN: z.string(),
  featured: z.boolean().default(false),
  growthRate: z.string(),
  growthHeight: z.string(),
  growthWidth: z.string(),
  bloomColor: z.string(),
  bloomTime: z.string(),
  bloomSeason: z.enum(['spring', 'summer', 'autumn', 'winter']),
  waterNeeds: z.enum(['low', 'moderate', 'high']),
  lightNeeds: z.enum(['low', 'indirect', 'direct']),
  sunlightHoursMin: z.number(),
  sunlightHoursMax: z.number(),
  temperatureRange: z.string(),
  humidityNeeds: z.string(),
  relativeHumidityNeeds: z.string(),
  fertilizerNeeds: z.string(),
  soilNeeds: z.string(),
  nativeRegion: z.string(),
  predominantCRRegions: z.string(),
  droughtTolerance: z.string(),
  hardinessZone: z.string(),
  localNames: z.string(),
  culturalUses: z.string(),
  culturalUsesES: z.string(),
  toxicityPets: z.string(),
  toxicityHumans: z.string(),
  propagationMethods: z.array(z.string()),
  economicImportance: z.string(),
  localSeasonality: z.string(),
  warnings: z.array(z.string()),
  warningsES: z.array(z.string()),
  careTips: z.array(z.string()),
  careTipsES: z.array(z.string()),
  facets: PlantFacetSchema,
  images: z.array(PlantImageSchema),
  genus: z.string(),
  cultivar: z.string().nullable(),
  lifeCycle: z.enum(['annual', 'perennial', 'biennial']),
  bloomStart: z.string(),
  bloomEnd: z.string(),
  phenologyRecords: z.array(PhenologyRecordSchema),
  companionPlants: z.array(CompanionPlantSchema),
  companionInfo: z.object({
    goodWith: z.array(z.string()),
    avoidWith: z.array(z.string()),
  }),
  pollinatorValue: PollinatorValueSchema,
  beneficialInsects: z.array(z.string()),
  pestRepellent: z.array(z.string()),
  harvestInfo: HarvestInfoSchema,
  culinaryUses: z.array(CulinaryUseSchema),
  commonPests: z.array(CommonPestSchema),
  diseaseResistance: z.string(),
  soilPreferences: SoilPreferencesSchema,
  climateSuitability: ClimateSuitabilitySchema,
  carbonSequestration: z.string(),
  biodiversityScore: z.number(),
  invasivePotential: z.string(),
  regionalAdaptations: z.array(RegionalAdaptationSchema),
  relatedPlants: z.array(z.object({ slug: z.string(), benefit: z.string() })),
  seedSources: z.array(z.object({ supplier: z.string(), url: z.string().url() })),
  organicCertification: z.string(),
  externalIds: ExternalIdsSchema,
  synonyms: z.array(z.string()),
  etymology: z.string(),
  tags: z.array(z.string()),
  searchKeywords: z.array(z.string()),
  metaDescription: z.string(),
  difficultyLevel: z.string(),
  maintenanceLevel: z.string(),
  popularityScore: z.number(),
  published: z.boolean(),
  source: z.object({
    api: z.string(),
    lastSyncedAt: z.union([z.date(), z.string().datetime()]),
    enrichmentLevel: z.number(),
  }),
  changeLog: z.array(ChangeLogEntrySchema),
  version: z.number(),
  createdAt: z.union([z.date(), z.string().datetime()]),
  updatedAt: z.union([z.date(), z.string().datetime()]),
  createdBy: z.string(),
  updatedBy: z.string(),
});

export type Plant = z.infer<typeof PlantSchema>;
export type PlantFacet = z.infer<typeof PlantFacetSchema>;
export type PlantImage = z.infer<typeof PlantImageSchema>;
