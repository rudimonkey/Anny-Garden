Key features of this initialization:
- **Monorepo Architecture:** Powered by Turborepo and pnpm, allowing for efficient sharing of code and types between the web and native applications.
- **Golden Schema:** A comprehensive Zod-based schema implemented in `packages/types` that serves as the canonical definition for all plant data.
- **Plant Specimens:** 5 full JSON samples (Albahaca, Monstera, Aloe Vera, Tomato, and Rosemary) provided in `Docs/Samples/` which strictly adhere to the Golden Schema.
- **Frontend Stack:** 
  - **Web:** Next.js App Router with Tailwind CSS integration.
  - **Native:** Expo with Expo Router and a shared **Tamagui** design system initialized in `packages/ui`.
- **Backend/Data Skeletons:** Skeletons for the Express API and Mongoose-based DB package have been created for future implementation.

Verified the setup by running a validation test against the Zod schema using the provided samples.
