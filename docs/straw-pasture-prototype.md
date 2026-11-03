# Straw & Pasture prototype

Branch: `feature/straw-pasture-v1`. The user approved a public progress preview on
November 2, 2026. Payment, billing, transaction-process, and production Console settings
remain unchanged.

## Implemented

- Responsive boarding homepage following Chloe's forest-green, cream, and gold design direction.
- Search uses the existing Sharetribe route, real published listings, configured filters, and native price units.
- Horse/Cattle shortcuts use real field IDs and option values only when a public enum or multi-enum animal filter is enabled in Console. Otherwise those cards remain informational and the separate “View all boarding” link opens search.
- Recent properties load through a page-level Redux thunk and the Marketplace SDK (including normal access control). Loading, empty, and error states are explicit; only saved Sharetribe Test records appear in search; demo records are visibly labeled.
- Search cards show only recognized, configured public boarding fields. Missing feeding/cleaning data is not interpreted as “not included.”
- Authentication, listing creation, conversations, galleries, native pricing, filters, sorting, and transactions retain their existing paths.
- Card layout changes are scoped so the existing featured-listing carousel keeps its original dimensions.
- Animal-boarding detail pages have a branded title/location header, a concise boarding overview, and a host-discussion checklist. They show supplied public details only and respect field display settings.
- Locations retain the native map when its provider is configured. Otherwise, a text location and directions guidance replace the broken map; fuzzy-location mode never reveals the exact address.
- The progress preview includes a four-step property draft: property, boarding/care, description/price, and review. Explicit saves stay in the current browser; drafts restore on return and are never submitted to Sharetribe.
- Shared grid and homepage width constraints keep the homepage and owner flow within narrow screens.

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

- 97 passing tests across 13 targeted suites for the homepage, listings, filters, native order panel,
  preview routing, owner draft validation/storage and form flow, and location fallbacks;
  includes two existing ListingCard snapshots.
- Production frontend and server bundle compilation.
- Browser review: homepage, real listing retrieval, animal/type/price search parameters,
  native filter controls, empty results, reset filters, and existing listing detail route.
- Browser review also covers the four-step owner flow, backward navigation, local save,
  and responsive layout in a 390px iframe alongside the desktop viewport.
- Account creation, messages, bookings, payments, and end-to-end transactions were not
  submitted during review. No Console settings changed in this second development pass.

Before a full marketplace launch, review legal/about content, supply real property details,
finish global branding/social links, configure maps if needed, and separately approve
transaction and payment setup.

## Public progress preview

Preview URL: https://straw-pasture-progress.tre20nt07.chatgpt.site

`node scripts/build-progress-preview.js` builds a static Test marketplace preview in `dist/`,
using the public Sharetribe **Test** application ID in `scripts/progress-preview.config.json`.
It adds the production bundle entrypoints to the static HTML shell, requests no indexing,
and packages the frontend assets without server files or source maps. Sites identity is
tracked in `.openai/hosting.json`; GitHub development remains on the feature branch.
The hosting manifest enables the native single-page-app fallback for direct page URLs;
no wildcard rewrite intercepts bundle or stylesheet requests.

Only this build enables `REACT_APP_PROGRESS_PREVIEW=true`: a visible Test label,
a route gate for unsupported server/payment operations, and listing price/details
in place of checkout forms. Native email/password accounts, listing creation,
availability, inquiries, and inbox routes are now enabled. These new flows require
an authenticated two-account browser verification; the browser connection failed
during this development pass.

At `/demo`, six clearly labeled fictional property templates and original illustrations
are ready to inspect. A designated-host importer resumes the partial Console draft,
creates missing Test samples, uploads images, and publishes only after image success.
It does not edit unrelated inventory. Import completion has not been verified.

At `/l/new`, owners use the existing authenticated Sharetribe listing wizard.
When no map provider is configured, the preview offers clearly labeled demo city
locations and labels resulting records as demos. Existing locations are retained.
At `/prepare-property`, the earlier browser-local four-step draft remains available.
These local drafts do not sync between devices or automatically publish.

The normal app build retains the existing Express backend and full marketplace flows.
Checkout, payouts, account deletion, and social authentication remain gated in the
static preview. See [launch-readiness.md](launch-readiness.md) for the stack, account
ownership, exact blockers, and handoff checklist.

## Photo

Decorative hero: Camille Perry, Unsplash, “A group of horses grazing on a lush green field.”
https://unsplash.com/photos/a-group-of-horses-grazing-on-a-lush-green-field-8Xw3Ipzmk4I
Free under the Unsplash License at retrieval. This is a mood image, not a listed property.

## Custom welcome entrance

The homepage plays a dismissible logo reveal once per browser session. The original circular logo fades in over a blurred glass overlay; its map pin drops into place, then the assembled mark shrinks and fades into the matching clean header logo. `/welcome` replays the entrance and returns to `/` after completion. Reduced-motion visitors enter directly. Skip, Escape, image-error handling, and a six-second failsafe prevent the entrance from blocking access.

The pending marketplace walkthrough is retained in [testing-walkthrough.md](testing-walkthrough.md).

## Member overview and expanded Test inventory

`/dashboard/host` and `/dashboard/buyer` load all pages of the signed-in account’s own listings and transaction records through the SDK. These are operational totals, not traffic analytics. Both views use the current account; cross-account inquiry testing requires a second Test customer. Checkout and payouts remain gated.

The eight fictional samples now use illustrative stock photographs. Their existing/new example prices are test placeholders only; hosts set their own prices. Additional animal values (goat, sheep, donkey, alpaca) are appended to the existing public multi-enum field only in the custom Test preview; the same options must be configured in Console before a production release. The existing search index is reused. No Live configuration or billing is changed.
