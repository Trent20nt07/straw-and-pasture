import React, { act } from 'react';
import '@testing-library/jest-dom';

import { types } from '../../../../util/sdkLoader';
import { fakeIntl } from '../../../../util/testData';
import { renderWithProviders as render, testingLibrary } from '../../../../util/testHelpers';

import EditListingLocationForm from './EditListingLocationForm';

const { screen, userEvent, fireEvent } = testingLibrary;

const noop = () => null;

beforeAll(() => {
  // Mock window.scroll - otherwise, Jest/JSDOM will print a not-implemented error.
  window.mapboxgl = { accessToken: 'test' };
  window.mapboxSdk = () => ({
    geocoding: {
      forwardGeocode: () => ({
        send: () =>
          Promise.resolve({
            body: { features: [] },
          }),
      }),
    },
  });
});

describe('EditListingDeliveryForm', () => {
  it('Check that shipping fees can be given and submit button activates', async () => {
    const user = userEvent.setup();
    const saveActionMsg = 'Save location';
    await act(async () => {
      render(
        <EditListingLocationForm
          intl={fakeIntl}
          dispatch={noop}
          onSubmit={noop}
          saveActionMsg={saveActionMsg}
          updated={false}
          updateInProgress={false}
          disabled={false}
          ready={false}
        />
      );
    });

    // Pickup fields
    const address = 'EditListingLocationForm.address';
    expect(screen.getByText(address)).toBeInTheDocument();

    const building = 'EditListingLocationForm.building';
    expect(screen.getByText(building)).toBeInTheDocument();

    // Test that save button is disabled at first
    expect(screen.getByRole('button', { name: saveActionMsg })).toBeDisabled();

    await user.type(screen.getByTestId('location-search'), 'Erottajankatu 19, Helsinki');
    await user.type(screen.getByRole('textbox', { name: building }), 'B');
  });
});

describe('preview city fallback', () => {
  const originalPreview = process.env.REACT_APP_PROGRESS_PREVIEW;
  beforeEach(() => {
    process.env.REACT_APP_PROGRESS_PREVIEW = 'true';
  });
  afterEach(() => {
    if (originalPreview === undefined) delete process.env.REACT_APP_PROGRESS_PREVIEW;
    else process.env.REACT_APP_PROGRESS_PREVIEW = originalPreview;
  });
  const setup = async initialValues => {
    const onSubmit = jest.fn();
    // A nested provider overrides testHelpers' dummy map token.
    const { ConfigurationProvider } = require('../../../../context/configurationContext');
    await act(async () =>
      render(
        <ConfigurationProvider value={{ maps: { mapProvider: 'mapbox' } }}>
          <EditListingLocationForm
            onSubmit={onSubmit}
            saveActionMsg="Save location"
            initialValues={initialValues}
          />
        </ConfigurationProvider>
      )
    );
    return { user: userEvent.setup(), onSubmit };
  };
  it('submits an explicitly illustrative city location without geocoding', async () => {
    const { user, onSubmit } = await setup();
    expect(screen.getByRole('button', { name: 'Save location' })).toBeDisabled();
    await user.selectOptions(screen.getByRole('combobox'), 'cedar-rail-stables');
    await user.click(screen.getByRole('button', { name: 'Save location' }));
    expect(onSubmit.mock.calls[0][0].location).toMatchObject({
      demoLocation: true,
      selectedPlace: {
        address: 'Aiken, South Carolina, United States',
        origin: { lat: 33.56, lng: -81.72 },
      },
    });
    expect(screen.queryByTestId('location-search')).not.toBeInTheDocument();
  });
  it('retains an existing property location without replacing it with a demo city', async () => {
    const location = {
      search: 'Existing address',
      selectedPlace: { address: 'Existing address', origin: new types.LatLng(1, 2) },
    };
    const { user, onSubmit } = await setup({ location });
    expect(screen.getByRole('combobox')).toHaveValue('__current');
    await user.click(screen.getByRole('button', { name: 'Save location' }));
    expect(onSubmit.mock.calls[0][0].location).toEqual(location);
  });
});
