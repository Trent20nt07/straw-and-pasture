import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createImageVariantConfig } from '../../util/sdkLoader';
import { storableError } from '../../util/errors';
import { fetchPageAssets } from '../../ducks/hostedAssets.duck';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';

export const ASSET_NAME = 'landing-page';

/** Load a small set of real listings using the same SDK and access controls as search. */
export const fetchRecentListings = createAsyncThunk(
  'app/LandingPage/fetchRecentListings',
  async (config, { dispatch, extra: sdk, rejectWithValue }) => {
    const {
      aspectWidth = 4,
      aspectHeight = 3,
      variantPrefix = 'listing-card',
    } = config.layout.listingImage;
    const typeFilter = config.listing.enforceValidListingType
      ? { pub_listingType: config.listing.listingTypes.map(t => t.listingType) }
      : {};
    try {
      const response = await sdk.listings.query({
        perPage: 4,
        sort: 'createdAt',
        ...typeFilter,
        include: ['images', 'author'],
        'fields.image': [`variants.${variantPrefix}`, `variants.${variantPrefix}-2x`],
        ...createImageVariantConfig(variantPrefix, 400, aspectHeight / aspectWidth),
        ...createImageVariantConfig(`${variantPrefix}-2x`, 800, aspectHeight / aspectWidth),
        'limit.images': 1,
      });
      dispatch(addMarketplaceEntities(response, { listingFields: config.listing.listingFields }));
      return response.data.data
        .filter(l => !l.attributes.deleted && l.attributes.state === 'published')
        .map(l => l.id);
    } catch (error) {
      return rejectWithValue(storableError(error));
    }
  }
);

const slice = createSlice({
  name: 'LandingPage',
  initialState: { recentListingIds: [], recentListingsLoading: false, recentListingsError: null },
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(fetchRecentListings.pending, state => {
        state.recentListingIds = [];
        state.recentListingsLoading = true;
        state.recentListingsError = null;
      })
      .addCase(fetchRecentListings.fulfilled, (state, action) => {
        state.recentListingIds = action.payload;
        state.recentListingsLoading = false;
      })
      .addCase(fetchRecentListings.rejected, (state, action) => {
        state.recentListingsLoading = false;
        state.recentListingsError = action.payload;
      }),
});
export default slice.reducer;

export const loadData = (params, search, config) => dispatch =>
  Promise.all([
    dispatch(fetchPageAssets({ landingPage: `content/pages/${ASSET_NAME}.json` }, true)),
    dispatch(fetchRecentListings(config)),
  ]);
