import reducer, { readAllPages, fetchDashboard } from './MemberDashboardPage.duck';

it('counts every page instead of silently limiting the overview to the first page', async () => {
  const query = jest.fn(async ({page}) => ({data:{data:[{id:page}],meta:{totalPages:3}}}));
  expect(await readAllPages(query, {only:'sale'})).toEqual([{id:1},{id:2},{id:3}]);
  expect(query).toHaveBeenLastCalledWith({only:'sale',page:3,perPage:100});
});
it('rejects a partial read rather than presenting incomplete totals', async () => {
  const query = jest.fn().mockResolvedValueOnce({data:{data:[{}],meta:{totalPages:2}}}).mockRejectedValueOnce(new Error('offline'));
  await expect(readAllPages(query, {})).rejects.toThrow('offline');
});
it('clears the previous role and ignores a stale response after changing views', () => {
  let state = reducer(undefined, fetchDashboard.pending('host-request', 'host'));
  state = reducer(state, fetchDashboard.pending('buyer-request', 'buyer'));
  state = reducer(state, fetchDashboard.fulfilled({role:'host',listings:[{}],transactions:[{}]}, 'host-request','host'));
  expect(state.role).toBe('buyer');
  expect(state.listings).toEqual([]);
  expect(state.loading).toBe(true);
  state = reducer(state, fetchDashboard.fulfilled({role:'buyer',listings:[],transactions:[]}, 'buyer-request','buyer'));
  expect(state.loading).toBe(false);
});
