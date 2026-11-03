import React from 'react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../util/testHelpers';
import messages from '../../translations/en.json';
import WelcomePage from './WelcomePage';

beforeEach(() => jest.spyOn(window, 'scrollTo').mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());
it('offers immediate entry and preserves native marketplace destinations', () => {
  const page = renderWithProviders(<WelcomePage />, { messages });
  expect(page.getByRole('heading', { level: 1 })).toHaveTextContent('A little more roomto roam.');
  expect(page.getByRole('link', { name: /Enter Straw & Pasture/ })).toHaveAttribute('href', '/');
  expect(page.getByRole('link', { name: /Find boarding/ })).toHaveAttribute('href', '/s');
  expect(page.getByRole('link', { name: /Have space to share/ })).toHaveAttribute('href', '/l/new');
  expect(page.getByRole('link', { name: /Sign in/ })).toHaveAttribute('href', '/login');
  expect(page.getByText(/Not a listed property/)).toBeInTheDocument();
});
