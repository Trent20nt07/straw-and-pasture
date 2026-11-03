import React from 'react';
import '@testing-library/jest-dom';
import {
  renderWithProviders,
  testingLibrary,
  getHostedConfiguration,
} from '../../util/testHelpers';
import messages from '../../translations/en.json';
import { BOARDING_DRAFT_KEY } from '../../util/boardingDraft';
import HostDraftPage from './HostDraftPage';

const { userEvent } = testingLibrary;
const config = () => ({
  ...getHostedConfiguration(),
  listingFields: {
    listingFields: [
      {
        key: 'animalsAccepted',
        label: 'Animals',
        scope: 'public',
        schemaType: 'multi-enum',
        enumOptions: [{ option: 'horse', label: 'Horse' }],
        filterConfig: { showFilter: true },
      },
      {
        key: 'boardingType',
        label: 'Boarding',
        scope: 'public',
        schemaType: 'enum',
        enumOptions: [{ option: 'pasture', label: 'Pasture' }],
      },
      {
        key: 'careServices',
        label: 'Care',
        scope: 'public',
        schemaType: 'multi-enum',
        enumOptions: [{ option: 'feeding', label: 'Feeding provided' }],
      },
    ],
  },
});
const render = () => renderWithProviders(<HostDraftPage />, { config: config(), messages });

beforeEach(() => {
  window.localStorage.clear();
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

it('validates, reviews, saves, and restores a local draft without publishing', async () => {
  const user = userEvent.setup();
  const page = render();
  await user.click(page.getByRole('button', { name: /Continue/ }));
  expect(page.getByRole('heading', { name: 'Start with the place.' })).toBeInTheDocument();
  expect(page.getAllByText('Please complete this field.').length).toBe(2);
  await user.type(page.getByLabelText('Property name'), 'North pasture');
  await user.type(page.getByLabelText('Town or city, and state'), 'Myrtle Beach, SC');
  await user.click(page.getByRole('button', { name: /Continue/ }));
  await user.click(page.getByLabelText('Horse'));
  await user.selectOptions(page.getByLabelText('Type of boarding'), 'pasture');
  await user.click(page.getByLabelText('Feeding provided'));
  await user.click(page.getByRole('button', { name: /Continue/ }));
  await user.type(
    page.getByLabelText('About your property'),
    'Open pasture with a shelter and access from the main lane.'
  );
  await user.type(page.getByLabelText(/Price in/), '25');
  await user.click(page.getByRole('button', { name: /Continue/ }));
  expect(page.getByRole('heading', { name: 'North pasture' })).toBeInTheDocument();
  expect(
    page.getByText('This is a private draft preview. Nothing has been published.')
  ).toBeInTheDocument();
  await user.click(page.getByRole('button', { name: /Save draft on this device/ }));
  expect(page.getByRole('status')).toHaveTextContent('Draft saved on this device');
  expect(JSON.parse(window.localStorage.getItem(BOARDING_DRAFT_KEY)).values).toMatchObject({
    title: 'North pasture',
    animals: ['horse'],
    boardingType: 'pasture',
    careServices: ['feeding'],
    price: '25',
  });
  page.unmount();
  const restored = render();
  expect(restored.getByLabelText('Property name')).toHaveValue('North pasture');
});
