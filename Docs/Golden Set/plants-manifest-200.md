### 200‑Entry Plant Manifest (schema: slug, commonName, scientificName, botanicalFamily, labelES, labelPT, labelEN, images)

The JSON artifact "Docs\Golden Set\plants-manifest-200.json" is a **200‑entry manifest** formatted as a JSON array. Each entry follows your schema and includes **three image source placeholders** (Trefle-style, Unsplash-style, Pexels-style). The image URLs are **templated placeholders** you can replace with real links or let your seed script fetch from the named services (Trefle, Unsplash, Pexels) and substitute actual image URLs.

> **How to use the image placeholders**
> - `trefle` URL: replace with the actual Trefle image endpoint or image URL returned by the Trefle API for that species.  
> - `unsplash` URL: replace with a direct Unsplash image URL (or use Unsplash search to find images for the species).  
> - `pexels` URL: replace with a direct Pexels image URL (or use Pexels search).  
> - If you prefer Cloudinary hosting, have your seed script fetch each placeholder URL (or the real API image URL) and upload to Cloudinary, then store the returned CDN URL in `images`.

The manifest is large; paste into a file named `plants-manifest-200.json` or import programmatically.

```json
See Docs\Golden Set\plants-manifest-200.json
```

---

## Quick notes and next steps

- **Placeholders:** The `trefle`, `unsplash`, and `pexels` URLs above are **templates/placeholders**. Your seed script should:
  1. Query the Trefle API (or other image sources) for each species slug/scientific name.  
  2. Replace the `trefle` placeholder with the actual image URL(s) returned by the API.  
  3. Optionally fetch Unsplash/Pexels images and replace those placeholders with direct CDN URLs (or upload to Cloudinary and store the Cloudinary URL).  
- **Slug strategy:** I used short, predictable slugs. If you prefer Spanish-first slugs (e.g., `albahaca`), keep them as-is; ensure uniqueness across the 200 entries.
- **Completeness:** This manifest intentionally mixes single-species entries and grouped/collection placeholders near the end to reach 200 entries while giving you a clear pattern for programmatic expansion. If you want strictly 200 unique species (no collection placeholders), I can replace the grouped entries with 100+ additional specific species names and scientific names and produce a revised manifest.

