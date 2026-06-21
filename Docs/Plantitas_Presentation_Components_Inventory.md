
The inventory (Docs\Plantitas_Presentation_Components_Inventory.html) lists these groups and components:

**`packages/ui` (6 components):** PlantCard, CategoryBadge, SearchBar, OfflineBadge, LoadingShimmer, ErrorBoundaryFallback.

**The SoT now adds 3 more** to `packages/ui`: `Pagination`, `Toast/Snackbar`, and `FeaturedBadge`. These were resolved as part of gap #8 and are missing from the HTML entirely.

**`apps/native` screens (11 items):** All present and paths match.

**`apps/native` screen-local components (8):** All present and paths match.

**`apps/web` public catalog (8):** All present. However, `WebPlantCard` is listed here — the SoT flags the `WebPlantCard` vs `PlantCard` usage governance as open item #7, but the inventory doesn't surface that ambiguity in any tag or note.

**`apps/web` admin panel (9):** All present and paths match.

**`apps/web` auth (1):** Present.

So the inventory is **mostly compatible** — structure, paths, layer taxonomy, and filter logic all hold. There are three concrete gaps:

1. **Three components missing entirely:** `Pagination` (`packages/ui/components/Pagination/`), `Toast` (`packages/ui/components/Toast/`), and `FeaturedBadge` (`packages/ui/components/FeaturedBadge/`). These are now first-class shared primitives with story and test requirements.

2. **`WebPlantCard` has no tag flagging the open governance question.** The SoT notes that `WebPlantCard` vs `PlantCard` usage rules are undefined — the inventory would benefit from an `ownership-tbd` or `see-open-item-7` tag on that row so it's visible when filtering.

3. **Minor: `featured` tag absent from relevant components.** `PlantCard` doesn't carry a `featured` tag even though it now needs to render `FeaturedBadge` when `plant.featured === true`. Not a breaking gap, but worth noting.

The quickest fix is to add those three missing entries to the `ALL` array in the HTML's script block and add the governance tag to `WebPlantCard`. Everything else — the filter UI, stats counters, layer taxonomy, Storybook/test dot system — is fully compatible and doesn't need to change.

Would you like me to update the HTML file with those additions?