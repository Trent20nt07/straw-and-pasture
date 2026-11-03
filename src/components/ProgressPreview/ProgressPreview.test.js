import { isPreviewPath } from './ProgressPreview';
const id = '6ae8a7d4-f94a-4562-8be8-d52791ceed25';
describe('Test progress preview routes', () => {
  it.each([
    '/',
    '/s',
    '/s/animal-boarding',
    `/l/oak-creek/${id}`,
    '/p/about',
    '/login',
    '/signup',
    '/signup/landowner',
    '/recover-password',
    '/reset-password',
    '/verify-email',
    '/confirm',
    '/profile-settings',
    '/inbox',
    '/inbox/sales',
    '/inbox/orders',
    `/order/${id}`,
    `/sale/${id}/details`,
    '/listings',
    '/l/new',
    `/l/oak-creek/${id}/draft`,
    `/l/oak-creek/${id}/draft/photos`,
    `/l/oak-creek/${id}/edit/availability`,
    '/account/contact-details',
  ])('allows the supported browser flow %s', path => expect(isPreviewPath(path)).toBe(true));
  it.each([
    '/checkout/123',
    `/l/oak-creek/${id}/checkout`,
    `/l/oak-creek/${id}/make-offer`,
    '/account/payments',
    '/account/payment-methods',
    '/account/manage',
    `/l/oak-creek/${id}/edit/payout`,
    `/l/oak-creek/${id}/edit/photos/return`,
    '/api/auth/google',
    '/inbox/unknown',
    `/sale/${id}/checkout`,
    '/unknown',
  ])('gates unsupported or payment flow %s', path => expect(isPreviewPath(path)).toBe(false));
});
