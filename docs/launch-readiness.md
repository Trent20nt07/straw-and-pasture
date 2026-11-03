# Straw & Pasture: launch readiness and handoff

Updated November 3, 2026. Development branch: `feature/straw-pasture-v1`.

This is a progress and decision record, not a claim that the marketplace is ready
to take real bookings. Public preview publication is authorized. Real payments,
billing changes, new paid subscriptions, and production account ownership changes
still require the owner's explicit approval.

## The stack, in plain English

Straw & Pasture has a custom React website built from Sharetribe's web template.
GitHub stores its source code and change history. The current public progress
preview is hosted through ChatGPT Sites and reads marketplace data from
Sharetribe's **Test** environment. Sharetribe Console is the administration panel
for marketplace content, listing fields, users, and transaction configuration.

Mapbox is the selected location provider, but a working key for the custom preview
has not been verified. Stripe is the platform used for payment and payout flows;
real payments are not enabled in this preview. A complete launch also needs the
application's existing Node.js/Express server, a confirmed production host and
domain, reviewed policies, and tested account and notification flows.

The public preview's availability does not mean that real booking, payment, or
production email delivery has been verified.

## Accounts and ownership handoff

| System | Current verified connection | Required handoff or decision |
| --- | --- | --- |
| GitHub | Repository `Trent20nt07/straw-and-pasture`; development on `feature/straw-pasture-v1` | Confirm the agreed long-term repository owner, Chloe's access, developer permissions, and who maintains releases. No transfer has been performed. |
| Sharetribe | Straw & Pasture **Test** marketplace; listing data and hosted configuration used by the custom preview | Confirm the business owner, administrator access, Live environment entitlement, and subscription responsibility. Test access does not establish production readiness or legal ownership. |
| ChatGPT Sites | Public progress preview; project `appgprj_6ae8fca829c48191af75eb590643caf1` | Treat this as the demonstration host until a full production hosting decision is made. Preserve this project and URL while reviewing progress. |
| Mapbox | Selected provider in application configuration; no map asset/token returned by the read-only Test asset check | Supply or authorize access to the business's Mapbox account and a public token restricted to the intended website origins. Confirm usage limits and billing before enabling chargeable service. |
| Stripe | Existing application includes Stripe integration; no real payment activation performed | For custom sandbox checkout, verify the Sandbox credentials and host onboarding. For Live, confirm the business-owned Stripe account, payout ownership, commissions, refund rules, and explicit activation approval. |
| Domain and DNS | Preview uses the existing `chatgpt.site` URL | Confirm the desired domain, its owner/registrar, DNS administrator, and permission for specific record changes. No domain ownership or purchase is assumed. |
| Outgoing email | Sharetribe supports marketplace notifications; branded sender setup and delivery have not been verified | Confirm the business-controlled sender address, DNS access, reply/support mailbox, and supported plan. Test actual delivery and links before launch. |

Preview: https://straw-pasture-progress.tre20nt07.chatgpt.site/

## Readiness record

| Area | Evidence/status | Remaining work |
| --- | --- | --- |
| Branding and browsing | Implemented and browser-reviewed: homepage, native search/filtering, property pages, boarding details, location fallback, and narrow-screen layouts | Review Chloe's final copy and genuine property content. |
| Existing inventory | The preview retrieves Sharetribe Test listings; existing listings are preserved | Do not fill missing property facts by inference. |
| Six demonstration properties | Six original labeled illustrations and complete sample templates are available at `/demo`. A guarded, resumable importer is implemented. One Console draft was created; browser automation disconnected at image upload. | Sign in as the designated Test host at `/demo`, run the import, and verify all six saved records. None are certified published by this pass. |
| Local owner preparation | Four-step draft form retained at `/prepare-property`; explicit saves stay in the browser | Explain that these drafts do not sync or publish automatically. |
| Native Test accounts and listings | Preview routes now enable native email/password login, signup, listing drafts, images, availability, and publication through the existing SDK. Missing map keys use an explicitly illustrative city selector. | Verify separate customer/host sessions and persistence in the deployed preview. Browser automation was unavailable; these flows are not certified end-to-end. |
| Payout requirement for publication | Live read-only Test configuration reports `animal-boarding.defaultListingFields.payoutDetails: false` | Native publishing can proceed without a payout account; this does **not** make the listing bookable through Stripe. |
| Inquiry and inbox | Native Test inbox and inquiry routes are enabled; the existing browser SDK sends the inquiry and messages | Verify that the host receives the inquiry and replies, and the customer sees the reply. |
| Interactive maps and address search | Custom preview currently has a text fallback; map configuration asset was absent in the inspected Test assets | Obtain a valid authorized provider key, configure it, and verify search, pins, address entry, and any location-privacy setting. |
| Full booking and sandbox checkout | Default `default-booking/release-1` code is retained; complete custom-host checkout has not been verified | Deploy server endpoints, configure matching Sandbox credentials, create a sandbox-enabled host, and test the complete transaction lifecycle. |
| Production | Not launched as a transacting marketplace | Complete the launch gates below and obtain approval for real payments/billing. |

This development pass passed 322 targeted tests across 17 suites and 116
snapshots, covering the importer, preview route safeguards, demo workspace,
location fallback, native account/listing/inbox flows, and existing browsing.
The optimized preview frontend and normal Express server compiled successfully. Browser/API verification
is still required for the new authenticated flows; these tests do not certify
a completed booking.

## Sample import and current verification limit

The public demo workspace is https://straw-pasture-progress.tre20nt07.chatgpt.site/demo.
Its sample cards are explicitly templates, not claimed search results. Only the
existing designated Test host can use the import button. The importer checks the
exact Test application ID and authenticated host before writing, reads every page
of the host's inventory, resumes matching drafts, and leaves published, closed,
pending, and unrelated listings alone. Failed image uploads prevent publication.
Repeated runs reuse saved demo records. Avoid simultaneous imports in multiple tabs.

The partial Palmetto draft has ID `6ae9155b-2ab1-4160-8ec2-63764e69b7bb`.
The importer recognizes this record instead of creating a second Palmetto listing.
The remaining samples are Cedar Rail Stables, Lowcountry Grazing, Blue Ridge Run-In,
Sandhills Cattle Pasture, and Foothills Boarding Barn. Prices, availability, and
city-level coordinates are fictional; all six images carry visible demo labels.
The original Oak Creek listing is not edited by the importer.

Browser automation became unresponsive during the Console draft's image upload.
Its final image/published state, custom-preview login, two-account conversation,
and new responsive UI have not been browser-verified. Repository tests and builds
are recorded separately; they do not replace authenticated integration testing.

## Recommended production deployment

Deploy the **existing full Node.js/Express application** on a host that supports
its runtime and server entrypoint. Retain the React/Redux/Final Form application,
Sharetribe SDK integration, normal server rendering, and existing transaction
logic. The build/start sequence is defined in `package.json`: the normal build
produces frontend and server bundles; the production process starts
`server/index.js`. The preview-only build is not a replacement for that server.

The current Sites artifact is static and does not run the Express API routes.
Sites' server runtime is Cloudflare Workers. A Worker rewrite is a separate
engineering change requiring session, API, asset, and runtime compatibility
validation. It is not the recommended shortcut for production launch.

No new hosting provider, paid plan, domain purchase, or subscription has been
selected or purchased by this checklist. Evaluate the business's existing
accounts before choosing a host. Keep Test and Live credentials and deployments
separate. Confirm Sharetribe's custom-code hosting requirements for the selected
Live account before scheduling a cutover.

## Full booking blockers and acceptance checks

The custom application needs these same-origin routes from `server/apiRouter.js`:

| Route | Purpose |
| --- | --- |
| `POST /api/transaction-line-items` | Calculate the price breakdown using the actual listing and commission configuration. |
| `POST /api/initiate-privileged` | Start privileged booking transitions with server-calculated line items. |
| `POST /api/transition-privileged` | Continue privileged transitions, including a booking after an inquiry. |
| `POST /api/delete-account` | Enforce transaction checks before account deletion. Keep unavailable until the server is ready. |
| `GET /api/initiate-login-as` and `GET /api/login-as` | Console's operator login-as flow. It is distinct from normal email/password login. |
| `/api/auth/*` | Optional social-login flows. Do not advertise them until configured and tested. |

The trusted SDK exchange uses the application client secret on the server.
Trusted access tokens must remain server-side. Preserve the shared refreshed
cookie store and per-request SDK instances in `server/api-util/sdk.js`.

Before enabling checkout in the custom preview:

1. Verify the customer and host use separate Sharetribe Test accounts.
2. Confirm the listing's animal/boarding fields, real price unit, timezone,
   available dates, and seat count.
3. Verify server-calculated line items and commission match the checkout total.
4. Confirm the browser publishable key and Console Sandbox secret belong to the
   same Stripe Sandbox; complete the test host's payout setup with test details.
5. Submit a sandbox booking, verify payment authorization, accept/decline as the
   host, and confirm the resulting state in both accounts and Console.
6. Test unavailable dates, duplicate submission, cancellation/refund behavior,
   session expiry, and relevant notification links.
7. Record observed outcomes. Do not substitute a local success screen for an
   actual Sharetribe transaction or claim the complete flow works from unit
   tests alone.

The existing transaction process is preserved. Any future process change must
be reviewed against both the frontend state machine and the Sharetribe backend.

## Environment configuration checklist

Names only are listed here. No secrets belong in this file, GitHub, the client
bundle, or the hosting manifest. Variables beginning `REACT_APP_` are public
build configuration; server credentials must never use that prefix.

| Variable | Use |
| --- | --- |
| `REACT_APP_SHARETRIBE_SDK_CLIENT_ID` | Public application ID for the intended Test or Live environment. |
| `SHARETRIBE_SDK_CLIENT_SECRET` | Server-only secret for that same application; required for privileged operations. |
| `REACT_APP_MARKETPLACE_ROOT_URL` | Canonical HTTPS origin of the corresponding deployment. |
| `REACT_APP_MARKETPLACE_NAME` | Marketplace identity used by the app. |
| `REACT_APP_ENV` | Application environment configuration. Selecting this label does not change which marketplace a client ID addresses. |
| `NODE_ENV` and `PORT` | Node runtime mode and host-provided listening port. |
| `REACT_APP_SHARETRIBE_USING_SSL` | Secure SDK cookies and HTTPS behavior. |
| `SERVER_SHARETRIBE_REDIRECT_SSL` and `SERVER_SHARETRIBE_TRUST_PROXY` | Configure only to match the selected host's TLS/proxy arrangement. |
| `REACT_APP_MAPBOX_ACCESS_TOKEN` | Public Mapbox token if it is not supplied by hosted configuration. |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Alternative public location-provider key; do not configure both providers without an intentional selection. |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Browser Stripe Sandbox or Live key corresponding to the environment. The Stripe secret is configured in Sharetribe Console. |
| `REACT_APP_PROGRESS_PREVIEW` | Enables the repository's demonstration safeguards; do not disable it merely to expose unsupported actions. |
| `REACT_APP_CSP` | Content Security Policy mode. Review permitted external services and test enforcement. |
| `BASIC_AUTH_USERNAME` and `BASIC_AUTH_PASSWORD` | Optional server-side staging protection when selected; keep values in host secrets. |

Optional social-login, analytics, and error-monitoring integrations are listed in
`.env-template`. Their presence in a template is not evidence that an account is
connected. No additional analytics, CRM, or email marketing service is required
to demonstrate the core marketplace.

## Launch gates

- **Domain and hosting:** Confirm owner, host account, supported Node runtime,
  deployment permissions, DNS records, HTTPS, health checks, and a tested rollback.
- **Email:** Confirm Console sender settings and supported plan. Add only the
  DNS records generated for the approved sender domain. Verify signup, password
  reset, inquiry, booking, and cancellation messages arrive with working links.
- **Content and policies:** Replace template social links and unfinished About
  content. Obtain owner-approved terms, privacy notice, booking/cancellation and
  refund rules, care responsibilities, prohibited activities, emergency/contact
  process, and appropriate professional review. These documents are not supplied
  or legally approved by this checklist.
- **Live inventory:** Obtain host-approved descriptions, photos, prices,
  availability, and location disclosure. Remove or exclude every demo record
  from the Live launch.
- **Payments:** Obtain explicit approval for Live Stripe connection, payout
  arrangements, commissions, and any billing changes before enabling charges.
- **Ownership and support:** Record the business owner and recovery contacts for
  each service, developer access, support responsibility, and ongoing costs.
- **Final verification:** Complete a controlled Live readiness review only after
  the above decisions. A public demo URL is not evidence that these gates passed.

## Demonstration walkthrough for Chloe

Use this sequence after each relevant capability has been verified in the
published build. Label unavailable steps clearly rather than presenting them as
working.

1. Open the preview and point out its Test/demo notice.
2. Open `/demo` to see all six sample templates. After authenticated import, browse the saved Test properties; compare horse, cattle, and mixed boarding,
   different prices, pasture/stall/shelter, and included care services.
3. Apply animal, boarding, care, and price filters; clear them and check results.
4. Open a property, review photos, supplied facts, location text, and the price
   unit. Show interactive maps only after a real provider connection is verified.
5. At `/prepare-property`, prepare and save a browser-local owner draft. Explain its storage limitation.
6. Once enabled and tested, sign into a Test host account, create a native listing
   draft, add an image and availability, save it, and verify it after returning.
7. As a separate Test customer, send an inquiry; show the host reply and the
   matching customer inbox. Do not send demo messages to real unrelated hosts.
8. Demonstrate a complete sandbox booking only after server and Stripe Sandbox
   acceptance checks pass. Until then, state exactly why checkout is unavailable.
9. Finish in Sharetribe Console to show where the test listings, users, and
   transactions are administered, then explain GitHub's role in code maintenance.

## Evidence and official references

Repository evidence: `.openai/hosting.json`, `scripts/build-progress-preview.js`,
`src/components/ProgressPreview/ProgressPreview.js`, `src/ducks/auth.duck.js`,
`src/containers/EditListingPage/EditListingPage.duck.js`,
`src/containers/EditListingPage/EditListingWizard/EditListingWizard.js`,
`src/containers/ListingPage/ListingPage.duck.js`, `server/apiRouter.js`,
`server/api-util/sdk.js`, `server/index.js`, and `.env-template`.

Read-only hosted configuration inspection on November 2, 2026 verified the
`animal-boarding` payout requirement and the absent custom map asset described
above. No credential values were copied into this document.

- [Sharetribe: deploy the full web template](https://www.sharetribe.com/docs/template/hosting/how-to-deploy-template-to-production/)
- [Sharetribe: template setup and required integrations](https://www.sharetribe.com/docs/introduction/getting-started-with-web-template/)
- [Sharetribe: location services](https://www.sharetribe.com/help/en/articles/8676185-how-to-set-up-mapbox-or-google-maps-for-location-services)
- [Sharetribe: Test and Live Stripe setup](https://www.sharetribe.com/help/en/articles/8413086-how-to-set-up-stripe-for-payments-on-your-marketplace)
- [Sharetribe: configure the outgoing email address](https://www.sharetribe.com/help/en/articles/8704439-how-to-configure-your-outgoing-email-address)

Provider capabilities and plan requirements can change. Recheck the selected
account and current documentation before purchasing or changing a production
service.
