import { types } from './sdkLoader';
import {
  demoProperties,
  importDemoProperties,
  DEMO_TEST_CLIENT_ID,
  DEMO_HOST_ID,
} from './demoProperties';
const response = data => ({ data: { data } });
const fixture = (records = []) => {
  const sdk = {
    currentUser: { show: jest.fn(async () => response({ id: { uuid: DEMO_HOST_ID } })) },
    ownListings: {
      query: jest.fn(async () => ({ data: { data: records, meta: { totalPages: 1 } } })),
      createDraft: jest.fn(async values => {
        const listing = {
          id: { uuid: `created-${records.length}` },
          attributes: { ...values, state: 'draft' },
        };
        records.push(listing);
        return response(listing);
      }),
      update: jest.fn(async ({ id, images, ...values }) => {
        const listing = records.find(l => l.id.uuid === id.uuid);
        Object.assign(listing.attributes, values);
        if (images) listing.relationships = { images: { data: images } };
        return response(listing);
      }),
      publishDraft: jest.fn(async ({ id }) => {
        const listing = records.find(l => l.id.uuid === id.uuid);
        listing.attributes.state = 'published';
        return response(listing);
      }),
    },
    images: { upload: jest.fn(async () => response({ id: { uuid: 'image-id' } })) },
  };
  const options = {
    sdk,
    types,
    enabled: true,
    clientId: DEMO_TEST_CLIENT_ID,
    loadImage: jest.fn(async key => key),
  };
  return { sdk, records, options };
};
it.each([{ enabled: false }, { clientId: 'different-environment' }])(
  'rejects unsafe environment before API use: %o',
  async override => {
    const { sdk, options } = fixture();
    await expect(importDemoProperties({ ...options, ...override })).rejects.toThrow(
      'demo-environment'
    );
    expect(sdk.currentUser.show).not.toHaveBeenCalled();
    expect(sdk.ownListings.createDraft).not.toHaveBeenCalled();
  }
);
it('requires the designated authenticated Test host', async () => {
  const { sdk, options } = fixture();
  sdk.currentUser.show.mockResolvedValue(response({ id: { uuid: 'other-user' } }));
  await expect(importDemoProperties(options)).rejects.toThrow('demo-host');
  expect(sdk.ownListings.query).not.toHaveBeenCalled();
});
it('creates six labeled Test records with images and availability without duplicating them on rerun', async () => {
  const { sdk, options, records } = fixture();
  await expect(importDemoProperties(options)).resolves.toHaveLength(6);
  await expect(importDemoProperties(options)).resolves.toHaveLength(6);
  expect(sdk.ownListings.createDraft).toHaveBeenCalledTimes(6);
  expect(sdk.ownListings.publishDraft).toHaveBeenCalledTimes(6);
  expect(sdk.images.upload).toHaveBeenCalledTimes(6);
  records.forEach(l => {
    expect(l.attributes.title).toMatch(/^Demo · /);
    expect(l.attributes.publicData.demoListing).toBe(true);
    expect(l.attributes.description).toContain('not an available property');
    expect(l.attributes.availabilityPlan.entries).toHaveLength(7);
    expect(l.relationships.images.data).toHaveLength(1);
  });
});
it('resumes the existing Console draft and preserves its uploaded image', async () => {
  const first = demoProperties[0];
  const listing = {
    id: { uuid: first.resumeId },
    attributes: { title: `Demo · ${first.name}`, state: 'draft', publicData: {} },
    relationships: { images: { data: [{ id: 'existing-image' }] } },
  };
  const { sdk, options } = fixture([listing]);
  await importDemoProperties(options);
  expect(sdk.ownListings.createDraft).toHaveBeenCalledTimes(5);
  expect(sdk.images.upload).toHaveBeenCalledTimes(5);
  expect(listing.relationships.images.data[0].id).toBe('existing-image');
});
it('does not publish after image failure and can resume without creating another draft', async () => {
  const { sdk, options } = fixture();
  sdk.images.upload.mockRejectedValueOnce(new Error('network'));
  await expect(importDemoProperties(options)).rejects.toThrow('network');
  expect(sdk.ownListings.publishDraft).not.toHaveBeenCalled();
  await expect(importDemoProperties(options)).resolves.toHaveLength(6);
  expect(sdk.ownListings.createDraft).toHaveBeenCalledTimes(6);
});
it('reads all pages and leaves closed and pending records untouched', async () => {
  const records = demoProperties.map((p, i) => ({
    id: { uuid: p.key },
    attributes: { publicData: { demoSeed: p.key }, state: i % 2 ? 'closed' : 'pendingApproval' },
  }));
  const { sdk, options } = fixture(records);
  sdk.ownListings.query.mockImplementation(async ({ page }) => ({
    data: { data: page === 1 ? [] : records, meta: { totalPages: 2 } },
  }));
  expect(await importDemoProperties(options)).toHaveLength(6);
  expect(sdk.ownListings.query).toHaveBeenCalledTimes(2);
  expect(sdk.ownListings.update).not.toHaveBeenCalled();
  expect(sdk.ownListings.publishDraft).not.toHaveBeenCalled();
});
