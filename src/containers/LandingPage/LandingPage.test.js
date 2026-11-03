import React from 'react';
import '@testing-library/jest-dom';

import { renderWithProviders as providerRender, testingLibrary } from '../../util/testHelpers';

import { LandingPageComponent } from './LandingPage';
import messages from '../../translations/en.json';
const render = (ui, options = {}) => providerRender(ui, { ...options, messages });

const { waitFor } = testingLibrary;

describe('LandingPage', () => {
  beforeEach(() => sessionStorage.setItem('straw-pasture-intro-seen-v1', '1'));
  afterEach(() => sessionStorage.clear());
  it('skips the entrance for reduced-motion visitors', () => {
    sessionStorage.clear();
    const previous = window.matchMedia;
    window.matchMedia = () => ({ matches: true });
    const { queryByRole } = render(<LandingPageComponent inProgress={false} />);
    expect(queryByRole('dialog')).not.toBeInTheDocument();
    expect(sessionStorage.getItem('straw-pasture-intro-seen-v1')).toBe('1');
    window.matchMedia = previous;
  });
  it('shows the entrance on a first visit and remembers dismissal', () => {
    sessionStorage.clear();
    const { getByRole, queryByRole } = render(<LandingPageComponent inProgress={false} />);
    expect(getByRole('dialog')).toBeInTheDocument();
    testingLibrary.fireEvent.click(getByRole('button', { name: /Skip intro/ }));
    expect(queryByRole('dialog')).not.toBeInTheDocument();
    expect(sessionStorage.getItem('straw-pasture-intro-seen-v1')).toBe('1');
  });
  it('renders the Fallback page on error', async () => {
    const errorMessage = 'LandingPage failed';
    let e = new Error(errorMessage);
    e.type = 'error';
    e.name = 'Test';

    const { getByText } = render(
      <LandingPageComponent pageAssetsData={null} inProgress={false} error={e} />
    );

    await waitFor(() => {
      expect(getByText('Oops, something went wrong!')).toBeInTheDocument();
      expect(getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('renders one branded homepage without duplicating hosted sections', async () => {
    const data = {
      sections: [
        {
          sectionType: 'columns',
          sectionId: 'test-section',
          numColumns: 1,
          title: { fieldType: 'heading2', content: 'Landing page' },
          description: {
            fieldType: 'paragraph',
            content: 'This is the description of the section',
          },
          blocks: [
            {
              blockType: 'defaultBlock',
              blockId: 'test-block',
              title: { fieldType: 'heading3', content: 'Block title here' },
              text: {
                fieldType: 'markdown',
                content: `**Lorem ipsum** dolor sit amet, consectetur adipiscing elit. Nulla orci nisi, lobortis sit amet posuere et, vulputate sit amet neque. Nam a est id lectus viverra sagittis. Proin sed imperdiet lorem. Duis aliquam fermentum purus, tincidunt venenatis felis gravida in. Sed imperdiet mi vitae consequat rhoncus. Sed velit leo, porta at lorem ac, iaculis fermentum leo. Morbi tellus orci, bibendum id ante vel, hendrerit efficitur lectus. Proin vitae condimentum justo. Phasellus finibus nisi quis neque feugiat, ac auctor ipsum suscipit.`,
              },
            },
          ],
        },
      ],
    };

    const { getByRole, queryByText } = render(
      <LandingPageComponent
        pageAssetsData={{ landingPage: { data } }}
        inProgress={false}
        error={null}
      />
    );

    await waitFor(() => {
      expect(
        getByRole('heading', { level: 1, name: 'Access agriculture. Anywhere.' })
      ).toBeInTheDocument();
      expect(queryByText('Block title here')).not.toBeInTheDocument();
    });
  });
});
