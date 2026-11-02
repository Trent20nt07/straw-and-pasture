import { isPreviewPath } from './ProgressPreview';

describe('public progress preview routes', () => {
  it('allows browsing but excludes account and transaction routes', () => {
    [
      '/',
      '/s',
      '/s/animal-boarding',
      '/l/oak-creek/6ae8a7d4-f94a-4562-8be8-d52791ceed25',
      '/p/about',
    ].forEach(path => {
      expect(isPreviewPath(path)).toBe(true);
    });
    [
      '/login',
      '/signup',
      '/l/new',
      '/checkout/123',
      '/inbox',
      '/account',
      '/l/oak-creek/6ae8a7d4-f94a-4562-8be8-d52791ceed25/edit',
    ].forEach(path => {
      expect(isPreviewPath(path)).toBe(false);
    });
  });
});
