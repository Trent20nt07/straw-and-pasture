import React from 'react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../util/testHelpers';
import messages from '../../translations/en.json';
import SectionMapMaybe from './SectionMapMaybe';

it('shows location text instead of a broken map without a provider token', () => {
  const page = renderWithProviders(
    <SectionMapMaybe
      geolocation={{ lat: 33, lng: -78 }}
      publicData={{ location: { address: 'Myrtle Beach, SC' } }}
      mapsConfig={{ mapProvider: 'mapbox', fuzzy: { enabled: false } }}
    />,
    { messages }
  );
  expect(page.getByText('Myrtle Beach, SC')).toBeInTheDocument();
  expect(page.queryByRole('button', { name: 'Show interactive map' })).not.toBeInTheDocument();
});

it('does not expose the address when fuzzy location is enabled', () => {
  const page = renderWithProviders(
    <SectionMapMaybe
      publicData={{ location: { address: 'Private street address' } }}
      mapsConfig={{ mapProvider: 'mapbox', fuzzy: { enabled: true } }}
    />,
    { messages }
  );
  expect(page.queryByText('Private street address')).not.toBeInTheDocument();
  expect(page.getByText('Ask the host about the property’s location.')).toBeInTheDocument();
});
