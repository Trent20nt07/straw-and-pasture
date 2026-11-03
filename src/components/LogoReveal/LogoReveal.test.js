import React from 'react';
import '@testing-library/jest-dom';
import { renderWithProviders, testingLibrary } from '../../util/testHelpers';
import messages from '../../translations/en.json';
import LogoReveal from './LogoReveal';
const { fireEvent, act } = testingLibrary;
const setup = () => {
  const done = jest.fn();
  return { done, ...renderWithProviders(<LogoReveal onComplete={done} />, { messages }) };
};
afterEach(() => jest.useRealTimers());
it('waits for artwork and ignores child animation completion', () => {
  const {container, done} = setup();
  const assembly = container.querySelector('svg').parentElement;
  fireEvent.load(container.querySelector('img'));
  fireEvent.animationEnd(container.querySelector('svg g'));
  expect(done).not.toHaveBeenCalled();
  fireEvent.animationEnd(assembly);
  expect(done).toHaveBeenCalledTimes(1);
});
it('allows keyboard dismissal and restores scrolling', () => {
  const {getByRole, done, unmount} = setup();
  expect(document.body.style.overflow).toBe('hidden');
  fireEvent.keyDown(getByRole('button'), {key: 'Escape'});
  expect(done).toHaveBeenCalledTimes(1);
  unmount();
  expect(document.body.style.overflow).not.toBe('hidden');
});
it('fails open when artwork fails or animation events never arrive', () => {
  jest.useFakeTimers();
  const {container, done} = setup();
  fireEvent.error(container.querySelector('img'));
  expect(done).toHaveBeenCalledTimes(1);
  act(() => jest.advanceTimersByTime(6000));
  expect(done).toHaveBeenCalledTimes(2);
});
