import { configureStore } from '@reduxjs/toolkit';
import reducer, { fetchRecentListings } from './LandingPage.duck';
import { createListing } from '../../util/testData';

const config = {
  layout: { listingImage: { aspectWidth: 4, aspectHeight: 3, variantPrefix: 'listing-card' } },
  listing: { listingFields: [], listingTypes: [], enforceValidListingType: false },
};
const makeStore = query =>
  configureStore({
    reducer,
    middleware: getDefault => getDefault({ thunk: { extraArgument: { listings: { query } } } }),
  });

describe('recent homepage listings', () => {
  it('uses the Marketplace API and retains only published, undeleted IDs', async () => {
    const query = jest
      .fn()
      .mockResolvedValue({
        data: {
          data: [
            createListing('published'),
            createListing('closed', { state: 'closed' }),
            createListing('deleted', { deleted: true }),
          ],
        },
      });
    const store = makeStore(query);
    await store.dispatch(fetchRecentListings(config));
    expect(query).toHaveBeenCalledWith(
      expect.objectContaining({ perPage: 4, sort: 'createdAt', include: ['images', 'author'] })
    );
    expect(store.getState().recentListingIds.map(id => id.uuid)).toEqual(['published']);
    expect(store.getState().recentListingsLoading).toBe(false);
  });
  it('clears stale results and exposes a failed request instead of substituting fixtures', async () => {
    const query = jest
      .fn()
      .mockResolvedValueOnce({ data: { data: [createListing('published')] } })
      .mockRejectedValueOnce(new Error('Access denied'));
    const store = makeStore(query);
    await store.dispatch(fetchRecentListings(config));
    await store.dispatch(fetchRecentListings(config));
    expect(store.getState().recentListingIds).toEqual([]);
    expect(store.getState().recentListingsError).toBeTruthy();
  });
});
