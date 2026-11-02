# Straw & Pasture prototype

Branch: `feature/straw-pasture-v1`. No deployment, payment, billing, transaction-process,
or production Console changes are part of this iteration.

## Implemented

- Responsive boarding homepage following Chloe's forest-green, cream, and gold design direction.
- Search uses the existing Sharetribe route, real published listings, configured filters, and native price units.
- Horse/Cattle shortcuts use real field IDs and option values only when a public enum or multi-enum animal filter is enabled in Console. Otherwise those cards remain informational and the separate “View all boarding” link opens search.
- Recent properties load through a page-level Redux thunk and the Marketplace SDK (including normal access control). Loading, empty, and error states are explicit; no demo inventory is mixed with real listings.
- Search cards show only recognized, configured public boarding fields. Missing feeding/cleaning data is not interpreted as “not included.”
- Authentication, listing creation, conversations, galleries, native pricing, filters, sorting, and transactions retain their existing paths.
- Card layout changes are scoped so the existing featured-listing carousel keeps its original dimensions.

## Test Console configuration

Saved in **Straw & Pasture Test** on November 2, 2026. Existing inventory and the
`animal-boarding` listing type are preserved.

| Field ID | Type | Options / purpose |
| --- | --- | --- |
| `animalsAccepted` | Existing required public multi-enum, searchable | `horse`: Horse; `cattle`: Cattle |
| `boardingType` | Public enum, searchable | `pasture`: Pasture; `stall`: Stall; `shelter`: Run-in shelter |
| `careServices` | Public multi-enum, searchable | `feeding`: Feeding provided; `stall-cleaning`: Stall cleaning provided |

The two new fields are optional and limited to `animal-boarding`. Care services display
selected options only. The animal filter remains primary; boarding type and care services
are secondary filters. Horse/Cattle shortcuts also select the appropriate listing type,
which Sharetribe requires to expose type-limited filters.

Main search uses keywords while Mapbox has no access token. Listing-type filtering is now
enabled. Price filtering remains 0–500, with the existing sorting options retained.
Location data is preserved; interactive maps still need a valid Mapbox setup.

Chloe's supplied round logo is uploaded, and the footer slogan and copyright are updated.
The Console's native color picker did not persist scripted edits, so its original global
color settings remain unchanged. The frontend palette is defined in `configBranding.js`
with `useLocalColors: true`, including native buttons and links; hosted logos and other
assets still come from Console. Set the flag to false to restore hosted color control.
Email colors remain unchanged. Existing template social links remain in the hosted footer configuration.

The existing listing type still uses `default-booking/release-1`, daily pricing, and
multiple seats. This implementation preserves Sharetribe's actual price unit rather than
presenting a daily price as monthly. No transaction-process or payout changes were made.

The existing Oak Creek test listing has no saved animal, boarding-type, or care-service
values. It appears in unfiltered results, but correctly does not match animal filters until
its host supplies those details. No property facts, inventory, or availability were invented.

Experiences, goods/services, and Chloe's barn-management dashboard are future phases, not
represented as functioning products in this prototype. No invented revenue, clients, ratings,
verified-host badges, or availability claims are shown.

## Validation

- 62 targeted tests across seven suites, including two existing ListingCard snapshots.
- Production frontend and server bundle compilation.
- Browser review: homepage, real listing retrieval, animal/type/price search parameters,
  native filter controls, empty results, reset filters, and existing listing detail route.
- Account creation, messages, bookings, payments, and end-to-end transactions were not
  submitted during review. Mobile layout is implemented in responsive CSS; browser review
  was performed at the available desktop viewport.

Before any public launch, review legal/about content, supply real property details, finish
global branding/social links, configure maps if needed, and separately approve deployment
and payment setup. This branch has not been publicly deployed.

## Photo

Decorative hero: Camille Perry, Unsplash, “A group of horses grazing on a lush green field.”
https://unsplash.com/photos/a-group-of-horses-grazing-on-a-lush-green-field-8Xw3Ipzmk4I
Free under the Unsplash License at retrieval. This is a mood image, not a listed property.
