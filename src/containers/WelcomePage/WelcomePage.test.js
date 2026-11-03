import React from 'react';
import '@testing-library/jest-dom';
import { renderWithProviders, testingLibrary } from '../../util/testHelpers';
import messages from '../../translations/en.json';
import WelcomePage from './WelcomePage';

beforeEach(() => {
  sessionStorage.setItem('straw-pasture-intro-seen-v1', '1');
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
});
afterEach(() => { sessionStorage.clear(); jest.restoreAllMocks(); });
it('replays the entrance even after an earlier visit and permits immediate entry', () => {
  const page = renderWithProviders(<WelcomePage />, { messages });
  expect(page.getByRole('dialog')).toBeInTheDocument();
  testingLibrary.fireEvent.click(page.getByRole('button', {name: /Skip intro/}));
  expect(page.queryByRole('dialog')).not.toBeInTheDocument();
  expect(sessionStorage.getItem('straw-pasture-intro-seen-v1')).toBe('1');
});
