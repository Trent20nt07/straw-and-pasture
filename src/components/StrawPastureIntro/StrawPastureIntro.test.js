import React from 'react';
import '@testing-library/jest-dom';
import { useLocation } from 'react-router-dom';
import {
  renderWithProviders as providerRender,
  testingLibrary,
  getHostedConfiguration,
} from '../../util/testHelpers';
import { createListing, createUser } from '../../util/testData';
import StrawPastureIntro from './StrawPastureIntro';
import messages from '../../translations/en.json';
const render = (ui, options = {}) => providerRender(ui, { ...options, messages });

const Location = () => <output data-testid="location">{useLocation().search}</output>;
const { userEvent } = testingLibrary;

describe('StrawPastureIntro', () => {
  it('shows a genuine empty state without fabricated inventory or host claims', () => {
    const { getByText, queryByRole } = render(<StrawPastureIntro />);
    expect(getByText('Your next pasture starts here.')).toBeInTheDocument();
    expect(queryByRole('link', { name: 'Browse horse boarding' })).not.toBeInTheDocument();
  });
  it('renders actual listing titles and links', () => {
    const listing = createListing('123', { title: 'Oak pasture' }, { author: createUser('host') });
    const { getByRole, queryByText } = render(<StrawPastureIntro recentListings={[listing]} />);
    expect(getByRole('link', { name: /Oak pasture/ })).toHaveAttribute(
      'href',
      '/l/oak-pasture/123'
    );
    expect(queryByText('Your next pasture starts here.')).not.toBeInTheDocument();
  });
  it('keeps failed requests distinct from an empty marketplace', () => {
    const { getByRole, queryByText } = render(
      <StrawPastureIntro recentListingsError={{ status: 403 }} />
    );
    expect(getByRole('status')).toHaveTextContent('We couldn’t load');
    expect(queryByText('Your next pasture starts here.')).not.toBeInTheDocument();
  });
  it('submits configured animal and budget filters to native search', async () => {
    const config = getHostedConfiguration();
    config.listingFields = {
      listingFields: [
        {
          key: 'animals',
          label: 'Animals',
          scope: 'public',
          schemaType: 'multi-enum',
          enumOptions: [
            { option: 'equine', label: 'Horse' },
            { option: 'bovine', label: 'Cattle' },
          ],
          filterConfig: { showFilter: true, group: 'primary' },
          saveConfig: { required: false },
        },
      ],
    };
    const user = userEvent.setup();
    const { getByLabelText, getByRole, getByTestId } = render(
      <>
        <StrawPastureIntro />
        <Location />
      </>,
      { config }
    );
    await user.selectOptions(getByLabelText('Your animals'), 'equine');
    await user.click(getByRole('button', { name: /Find boarding/ }));
    expect(new URLSearchParams(getByTestId('location').textContent).get('pub_animals')).toBe(
      'has_any:equine'
    );
  });
});
