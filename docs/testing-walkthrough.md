# Straw & Pasture Test walkthrough

Updated November 3, 2026 after the Test inventory and member dashboard implementation.
This checklist is partially complete. The preview does not certify marketplace readiness.

## Verified this session

- Test host sign-in succeeded (designated host account).
- Eight fictional demo listings published with stock photos; existing Oak Creek preserved.
- Host dashboard: 9 published properties, 0 drafts, 0 conversations.
- Buyer dashboard: authenticated role view loads, 0 activity. This is the same account, not a second-customer test.
- Goat search returns Riverbend Smallholding; all-listings search returns all 9 records.
- Riverbend details show saved Goat + Sheep values and uploaded photograph.
- Riverbend description edit saved and survived a full browser reload.
- Riverbend availability editor loads the stored weekly plan with one seat each day.
- Mobile homepage checked at 390px; clean logo and expanded animal selector render.
- 64 targeted tests passed across 8 suites; frontend and server builds passed.

## Next blocking step

Create or sign in to a separate Test buyer account using a different email controlled by the user.
Then send an inquiry, sign back into the host account, reply, and verify both inboxes and notifications.
User was unsure whether a buyer account already exists; no customer account was invented or created.

## Saved demo records

| Demo | Sharetribe Test listing ID |
| --- | --- |
| Palmetto Pasture Retreat | 6ae9155b-2ab1-4160-8ec2-63764e69b7bb |
| Cedar Rail Stables | 6ae9d5b5-ea4c-4dd1-aa66-b27b4cafc162 |
| Lowcountry Grazing | 6ae9d5b7-fe3e-44b9-a472-f7b9c554692c |
| Blue Ridge Run-In | 6ae9d5b8-a1c2-41d7-bb67-d918ef205599 |
| Sandhills Cattle Pasture | 6ae9d5b9-419e-429a-9cbb-61330f45f5f0 |
| Foothills Boarding Barn | 6ae9d5ba-924c-40a7-af9c-1fc257bec454 |
| Riverbend Smallholding | 6ae9d5bc-76ed-4454-ac25-708ce814f523 |
| Piedmont Alpaca Meadow | 6ae9d5bd-d289-4b18-b319-cacfe8be9e76 |

## Full walkthrough (retain unverified steps)


1. Open https://straw-pasture-progress.tre20nt07.chatgpt.site/demo.
2. Sign into the designated Sharetribe Test marketplace host account. Console
   credentials are separate. Use the marketplace password recovery if needed.
3. Return to `/demo`, select **Check and import 8 samples**, and keep the page open.
   The importer resumes the existing Palmetto draft and skips matching saved records.
4. Open **Browse saved listings**. Confirm all eight are published or review their
   status in Manage listings. Check images, explicit demo labels, daily prices,
   animal/boarding/care fields, and saved illustrative city locations.
5. Test horse, cattle, boarding, care, and price filters; clear filters and verify
   the expected records return. Existing Oak Creek facts must remain unchanged.
6. In a private browser window, create a separate Test customer with an email you
   control. Verify signup, sign-in, email verification, and password recovery.
7. Open a demo property and use **Contact** to send a test inquiry. A host cannot
   inquire about their own property.
8. Return to the host's inbox and reply. Confirm the same conversation appears
   in the customer's inbox and that applicable notifications arrive.
9. As the host, edit a test listing and availability, navigate away, and return
   to confirm saved state. Check desktop and narrow mobile layouts.
10. After a business-owned map key is configured, verify address suggestions,
    pins, provider restrictions, and privacy behavior.
11. After server hosting and Stripe Sandbox setup, run the booking lifecycle,
    totals, availability, accept/decline and applicable cancellation paths.
    Checkout remains gated until these dependencies are ready.

Record date, account role, listing ID, expected outcome, actual outcome, and any
failure. Keep demo inventory out of Live. Live payments and billing changes need
explicit approval; Test access alone is not approval to enable them.
