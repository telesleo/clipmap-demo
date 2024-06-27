import React from 'react';
import {
  cleanup, fireEvent, render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ConfirmAction from '../../components/ConfirmAction';
import confirmActionMocks from '../mocks/confirm-action';

const MAIN_ELEMENT_TEST_ID = 'confirm-action';
const OUTSIDE_ELEMENT_TEST_ID = 'outside-element';

describe('ConfirmAction', () => {
  const cancelFunction = jest.fn();
  const confirmFunction = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    render(
      <div>
        <ConfirmAction
          message={confirmActionMocks.message}
          cancel={cancelFunction}
          confirm={confirmFunction}
          data-testid={MAIN_ELEMENT_TEST_ID}
        />
        <div data-testid={OUTSIDE_ELEMENT_TEST_ID} />
      </div>,
    );
  });

  afterEach(() => {
    cleanup();
  });

  test('Renders the message', () => {
    const textElement = screen.getByText(confirmActionMocks.message);
    expect(textElement).toBeInTheDocument();
  });

  test('Renders cancel button', () => {
    const cancelButton = screen.getByText('Cancelar');
    expect(cancelButton).toBeInTheDocument();
  });

  test('Renders confirm button', () => {
    const confirmButton = screen.getByText('Confirmar');
    expect(confirmButton).toBeInTheDocument();
  });

  test('Cancel button calls function when clicked', () => {
    const cancelButton = screen.getByText('Cancelar');
    cancelButton.click();
    expect(cancelFunction).toHaveBeenCalled();
  });

  test('Confirm button calls function when clicked', () => {
    const confirmButton = screen.getByText('Confirmar');
    confirmButton.click();
    expect(confirmFunction).toHaveBeenCalled();
  });

  test('Calls cancel function with outside click', () => {
    const outsideElement = screen.getByTestId(OUTSIDE_ELEMENT_TEST_ID);
    outsideElement.click();
    expect(cancelFunction).toHaveBeenCalled();
  });

  test('Calls cancel function when "Escape" key is pressed', () => {
    const mainElement = screen.getByTestId(MAIN_ELEMENT_TEST_ID);
    fireEvent.keyDown(mainElement, { key: 'Escape' });
    expect(cancelFunction).toHaveBeenCalled();
  });

  test('Calls confirm function when "Enter" key is pressed', () => {
    const mainElement = screen.getByTestId(MAIN_ELEMENT_TEST_ID);
    fireEvent.keyDown(mainElement, { key: 'Enter' });
    expect(confirmFunction).toHaveBeenCalled();
  });
});
