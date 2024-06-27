import React from 'react';
import {
  cleanup, fireEvent, render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Space } from 'react-zoomable-ui';
import MapNode from '../../components/MapNode';
import mapNodeMocks from '../mocks/map-node';
import { NODE_HEIGHT, NODE_WIDTH } from '../../utils/constants';

describe('MapNode', () => {
  const addChildNode = jest.fn();
  const removeNode = jest.fn();
  const setName = jest.fn();
  const setFocus = jest.fn();

  test('Does not display delete button without removeNode function', () => {
    render(
      <Space>
        <MapNode
          id={mapNodeMocks.nodes[0].id}
          addChildNode={addChildNode}
          nodeName={mapNodeMocks.nodes[0].name}
          setName={setName}
          setFocus={setFocus}
          style={{
            height: NODE_HEIGHT,
            width: NODE_WIDTH,
          }}
          focus
        />
      </Space>,
    );

    const deleteButton = screen.queryByRole('button', { name: 'cut' });
    expect(deleteButton).not.toBeInTheDocument();
  });

  describe('Focus', () => {
    beforeEach(() => {
      jest.resetAllMocks();

      render(
        <Space>
          <MapNode
            id={mapNodeMocks.nodes[0].id}
            addChildNode={addChildNode}
            removeNode={removeNode}
            nodeName={mapNodeMocks.nodes[0].name}
            setName={setName}
            setFocus={setFocus}
            style={{
              height: NODE_HEIGHT,
              width: NODE_WIDTH,
            }}
            focus
          />
        </Space>,
      );
    });

    afterEach(() => {
      cleanup();
    });

    test('Renders an input with the node name', () => {
      const inputElement = screen.getByRole('textbox');
      expect(inputElement).toBeInTheDocument();
    });

    test('Renders addChildNode button', () => {
      const addChildNodeButton = screen.getByRole('button', { name: 'add' });
      expect(addChildNodeButton).toBeInTheDocument();
    });

    test('Renders delete button', () => {
      const deleteButton = screen.getByRole('button', { name: 'cut' });
      expect(deleteButton).toBeInTheDocument();
    });

    test('Can change name of the node', () => {
      const inputElement = screen.getByDisplayValue(mapNodeMocks.nodes[0].name);
      fireEvent.change(inputElement, { target: { value: mapNodeMocks.newName } });
      expect(setName).toHaveBeenCalledWith(mapNodeMocks.newName);
    });

    test('Can add child node', () => {
      const addChildNodeButton = screen.getByRole('button', { name: 'add' });
      addChildNodeButton.click();
      expect(addChildNode).toHaveBeenCalled();
    });

    test('Can delete node', () => {
      const deleteButton = screen.getByRole('button', { name: 'cut' });
      deleteButton.click();
      expect(removeNode).toHaveBeenCalled();
    });
  });

  describe('No focus', () => {
    beforeEach(() => {
      render(
        <Space>
          <MapNode
            addChildNode={addChildNode}
            removeNode={removeNode}
            nodeName={mapNodeMocks.nodes[0].name}
            setName={setName}
            setFocus={setFocus}
            style={{
              height: NODE_HEIGHT,
              width: NODE_WIDTH,
            }}
          />
        </Space>,
      );
    });

    test('Hides delete and add child node buttons without focus', () => {
      const addChildNodeButton = screen.queryByRole('button', { name: 'add' });
      expect(addChildNodeButton).not.toBeInTheDocument();
      const deleteButton = screen.queryByRole('button', { name: 'cut' });
      expect(deleteButton).not.toBeInTheDocument();
    });
  });
});
