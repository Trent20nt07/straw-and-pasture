/** Fictional, city-level examples. Never use these as production inventory. */
export const DEMO_TEST_CLIENT_ID = '73cc1a67-231f-4c80-b6d2-08bf555641cb';
export const DEMO_HOST_ID = '6ae8a75a-c70d-4d35-a41f-0ea3a1a002ae';
export const HOSTED_TEST_URL = 'https://strawpasture-7ejcch.mysharetribe-test.com';

export const demoProperties = [
  {
    key: 'palmetto-pasture',
    name: 'Palmetto Pasture Retreat',
    city: 'Conway, South Carolina',
    lat: 33.836,
    lng: -79.047,
    animals: ['horse'],
    boarding: 'pasture',
    care: ['feeding'],
    price: 28,
    resumeId: '6ae9155b-2ab1-4160-8ec2-63764e69b7bb',
  },
  {
    key: 'cedar-rail-stables',
    name: 'Cedar Rail Stables',
    city: 'Aiken, South Carolina',
    lat: 33.56,
    lng: -81.72,
    animals: ['horse'],
    boarding: 'stall',
    care: ['feeding', 'stall-cleaning'],
    price: 55,
  },
  {
    key: 'lowcountry-grazing',
    name: 'Lowcountry Grazing',
    city: 'Walterboro, South Carolina',
    lat: 32.905,
    lng: -80.666,
    animals: ['cattle'],
    boarding: 'pasture',
    care: [],
    price: 12,
  },
  {
    key: 'blue-ridge-shelter',
    name: 'Blue Ridge Run-In',
    city: 'Hendersonville, North Carolina',
    lat: 35.318,
    lng: -82.461,
    animals: ['horse', 'cattle'],
    boarding: 'shelter',
    care: ['feeding'],
    price: 32,
  },
  {
    key: 'sandhills-pasture',
    name: 'Sandhills Cattle Pasture',
    city: 'Camden, South Carolina',
    lat: 34.246,
    lng: -80.607,
    animals: ['cattle'],
    boarding: 'pasture',
    care: ['feeding'],
    price: 18,
  },
  {
    key: 'foothills-barn',
    name: 'Foothills Boarding Barn',
    city: 'Tryon, North Carolina',
    lat: 35.208,
    lng: -82.239,
    animals: ['horse'],
    boarding: 'stall',
    care: ['stall-cleaning'],
    price: 45,
  },
];

export const hasMapProvider = maps =>
  maps?.mapProvider === 'googleMaps' ? !!maps.googleMapsAPIKey : !!maps?.mapboxAccessToken;

export const isDemoListing = listing =>
  listing?.attributes?.publicData?.demoListing === true ||
  /^Demo · /.test(listing?.attributes?.title || '');

/** Run only with an authenticated, explicitly selected Test host. Resume interrupted drafts. */
export const importDemoProperties = async ({
  sdk,
  clientId,
  enabled,
  types,
  loadImage,
  onProgress,
}) => {
  if (!enabled || clientId !== DEMO_TEST_CLIENT_ID) throw new Error('demo-environment');
  const user = (await sdk.currentUser.show()).data.data;
  if (user.id.uuid !== DEMO_HOST_ID) throw new Error('demo-host');

  const existing = [];
  let page = 1;
  let totalPages = 1;
  do {
    const response = await sdk.ownListings.query({ page, perPage: 100, include: ['images'] });
    existing.push(...response.data.data);
    totalPages = response.data.meta?.totalPages || 1;
    page += 1;
  } while (page <= totalPages);

  const results = [];
  for (const sample of demoProperties) {
    let listing = existing.find(
      l =>
        l.attributes.publicData?.demoSeed === sample.key ||
        (sample.resumeId &&
          l.id.uuid === sample.resumeId &&
          l.attributes.title === `Demo · ${sample.name}`)
    );
    // Never reopen, overwrite or republish existing published/closed demo records.
    if (listing && listing.attributes.state !== 'draft') {
      results.push({ key: sample.key, id: listing.id.uuid, state: listing.attributes.state });
      onProgress?.([...results]);
      continue;
    }
    const values = {
      title: `Demo · ${sample.name}`,
      description: `DEMO LISTING — fictional property for testing Straw & Pasture. This is not an available property and cannot be booked for a real stay.\n\nA sample ${sample.boarding} setup near ${sample.city}, for comparing boarding options.\n\nAll property details, prices, city-level map positions, and availability are illustrative. Images are original labeled illustrations. Do not visit this location or arrange a real stay.`,
      price: new types.Money(sample.price * 100, 'USD'),
      geolocation: new types.LatLng(sample.lat, sample.lng),
      publicData: {
        listingType: 'animal-boarding',
        transactionProcessAlias: 'default-booking/release-1',
        unitType: 'day',
        animalsAccepted: sample.animals,
        boardingType: sample.boarding,
        careServices: sample.care,
        location: { address: `${sample.city}, United States`, building: '' },
        demoListing: true,
        demoSeed: sample.key,
      },
      availabilityPlan: {
        type: 'availability-plan/time',
        timezone: 'America/New_York',
        entries: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(dayOfWeek => ({
          dayOfWeek,
          seats: 1,
          startTime: '00:00',
          endTime: '00:00',
        })),
      },
    };
    const existingImages = listing?.relationships?.images?.data || [];
    listing = listing
      ? (await sdk.ownListings.update({ id: listing.id, ...values }, { expand: true })).data.data
      : (await sdk.ownListings.createDraft(values, { expand: true })).data.data;
    if (!existingImages.length) {
      const image = await loadImage(sample.key);
      const uploaded = await sdk.images.upload({ image });
      await sdk.ownListings.update({ id: listing.id, images: [uploaded.data.data.id] });
    }
    const published = (await sdk.ownListings.publishDraft({ id: listing.id }, { expand: true }))
      .data.data;
    results.push({ key: sample.key, id: published.id.uuid, state: published.attributes.state });
    onProgress?.([...results]);
  }
  return results;
};
