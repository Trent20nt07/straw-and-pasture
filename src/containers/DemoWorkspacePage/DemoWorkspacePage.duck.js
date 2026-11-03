import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import appSettings from '../../config/settings';
import { types } from '../../util/sdkLoader';
import { importDemoProperties } from '../../util/demoProperties';
import { loadDemoPropertyImage } from '../../util/api';

export const importSamples = createAsyncThunk(
  'DemoWorkspacePage/importSamples',
  async (_, { dispatch, extra: sdk, rejectWithValue }) => {
    try {
      return await importDemoProperties({
        sdk,
        types,
        clientId: appSettings.sdk.clientId,
        enabled: process.env.REACT_APP_PROGRESS_PREVIEW === 'true',
        loadImage: loadDemoPropertyImage,
        onProgress: results => dispatch(progress(results)),
      });
    } catch (_) {
      return rejectWithValue('import-failed');
    }
  },
  { condition: (_, { getState }) => !getState().DemoWorkspacePage.importing }
);

const slice = createSlice({
  name: 'DemoWorkspacePage',
  initialState: { importing: false, results: [], error: null, complete: false },
  reducers: {
    progress: (state, action) => {
      state.results = action.payload;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(importSamples.pending, state => {
        state.importing = true;
        state.error = null;
        state.complete = false;
      })
      .addCase(importSamples.fulfilled, (state, action) => {
        state.importing = false;
        state.results = action.payload;
        state.complete = true;
      })
      .addCase(importSamples.rejected, state => {
        state.importing = false;
        state.error = true;
      }),
});
export const { progress } = slice.actions;
export default slice.reducer;
