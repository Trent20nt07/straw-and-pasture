import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

/** Read every page so summary totals never silently truncate at 100 records. */
export const readAllPages = async (query, params) => {
  const records = [];
  let page = 1;
  let totalPages = 1;
  do {
    const response = await query({ ...params, page, perPage: 100 });
    records.push(...response.data.data);
    totalPages = response.data.meta?.totalPages || 1;
    page += 1;
  } while (page <= totalPages);
  return records;
};
export const fetchDashboard = createAsyncThunk('MemberDashboardPage/fetch', async (role, { extra: sdk }) => {
  if (!['host', 'buyer'].includes(role)) throw new Error('Invalid dashboard role');
  const transactions = await readAllPages(p => sdk.transactions.query(p), { only: role === 'host' ? 'sale' : 'order' });
  const listings = role === 'host' ? await readAllPages(p => sdk.ownListings.query(p), {}) : [];
  return { role, listings, transactions };
});
const slice = createSlice({
  name: 'MemberDashboardPage',
  initialState: { loading: true, error: false, role: null, listings: [], transactions: [] },
  reducers: {},
  extraReducers: b => b
    .addCase(fetchDashboard.pending, (s, a) => { s.loading = true; s.error = false; s.role = a.meta.arg; s.listings = []; s.transactions = []; s.requestId = a.meta.requestId; })
    .addCase(fetchDashboard.fulfilled, (s, a) => { if (s.requestId === a.meta.requestId) { Object.assign(s, a.payload); s.loading = false; } })
    .addCase(fetchDashboard.rejected, (s, a) => { if (s.requestId === a.meta.requestId) { s.loading = false; s.error = true; } }),
});
export const loadData = params => fetchDashboard(params.role);
export default slice.reducer;
