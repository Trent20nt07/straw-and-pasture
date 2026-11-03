import React from 'react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../util/testHelpers';
import { createCurrentUser } from '../../util/testData';
import { DEMO_HOST_ID } from '../../util/demoProperties';
import messages from '../../translations/en.json';
import DemoWorkspacePage from './DemoWorkspacePage';

beforeEach(() => jest.spyOn(window, 'scrollTo').mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());
it('labels the eight templates honestly and offers host sign-in without import access', () => {
  const page = renderWithProviders(<DemoWorkspacePage />, { messages });
  expect(page.getAllByText('Fictional sample template')).toHaveLength(8);
  expect(page.getAllByRole('img', { name: /Stock photograph/ })).toHaveLength(8);
  expect(page.getByRole('link', { name: 'Sign in as the Test host' })).toHaveAttribute(
    'href',
    '/login'
  );
  expect(
    page.queryByRole('button', { name: 'Check and import 8 samples' })
  ).not.toBeInTheDocument();
  expect(page.getByRole('link', { name: 'Prepare a local draft' })).toHaveAttribute(
    'href',
    '/prepare-property'
  );
});
it('offers import only to the designated Test host and handles closed records safely', () => {
  const page = renderWithProviders(<DemoWorkspacePage />, {
    messages,
    initialState: {
      user: { currentUser: createCurrentUser(DEMO_HOST_ID) },
      DemoWorkspacePage: {
        importing: false,
        complete: true,
        error: null,
        results: [{ key: 'palmetto-pasture', id: 'closed-id', state: 'closed' }],
      },
    },
  });
  expect(page.getByRole('button', { name: 'Check and import 8 samples' })).toBeInTheDocument();
  expect(page.getByRole('link', { name: 'View saved record' })).toHaveAttribute(
    'href',
    '/listings'
  );
});
it('does not offer import to another signed-in account', () => {
  const page = renderWithProviders(<DemoWorkspacePage />, {
    messages,
    initialState: { user: { currentUser: createCurrentUser('another-host') } },
  });
  expect(
    page.queryByRole('button', { name: 'Check and import 8 samples' })
  ).not.toBeInTheDocument();
});
