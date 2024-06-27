import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './map-node.module.css';

const ADD_BUTTON_OFFSET = 150;
const DELETE_BUTTON_OFFSET = -142;

export default function MapNode({
  id,
  style,
  isRootNode,
  invert,
  nodeName,
  setName,
  addChildNode,
  removeNode,
  focus,
  setFocus,
  rightBranch,
}) {
  const nodeRef = useRef();
  const inputRef = useRef();

  const [inputName, setInputName] = useState('');
  const [mouseOver, setMouseOver] = useState(false);
  const [isCursorToTheRight, setIsCursorToTheRight] = useState(true);

  const isAddButtonVisible = () => {
    const focusedOrMouseOver = focus || mouseOver;
    const hasName = nodeName && nodeName.length > 0;
    if (isRootNode) {
      return hasName && focusedOrMouseOver;
    }
    return focusedOrMouseOver;
  };

  const handleMouseMove = (event) => {
    const cursorX = event.clientX;
    const nodeRect = nodeRef.current.getBoundingClientRect();
    const middle = nodeRect.left + nodeRect.width / 2;
    setIsCursorToTheRight(cursorX >= middle);
  };

  const getAddButtonOffset = () => {
    if (isRootNode) {
      return isCursorToTheRight ? ADD_BUTTON_OFFSET : -ADD_BUTTON_OFFSET;
    }
    return invert ? -ADD_BUTTON_OFFSET : ADD_BUTTON_OFFSET;
  };

  useEffect(() => {
    setInputName(nodeName);
  }, []);

  useEffect(() => {
    setName(inputName);
  }, [inputName]);

  useEffect(() => {
    if (inputRef.current) {
      if (focus) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [focus]);

  return (
    <div
      ref={nodeRef}
      id={id}
      style={style}
      className={styles.node}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      onMouseMove={handleMouseMove}
    >
      {removeNode && (focus || mouseOver) && (
        <button
          className={styles['delete-node-button']}
          type="button"
          title="Deletar ramo"
          style={{
            left: `calc(50% + ${invert ? -DELETE_BUTTON_OFFSET : DELETE_BUTTON_OFFSET}px)`,
          }}
          onClick={removeNode}
        >
          <span
            className="material-symbols-outlined"
            style={{
              transform: rightBranch ? 'scaleX(1)' : 'scaleX(-1)',
            }}
          >
            cut
          </span>
        </button>
      )}
      <input
        ref={inputRef}
        className={styles['name-input']}
        placeholder={isRootNode ? 'Nome do mapa' : null}
        value={inputName}
        onChange={({ target }) => setInputName(target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      {isAddButtonVisible() && (
        <button
          className={styles['add-node-button']}
          type="button"
          title="Adicionar node"
          style={{
            left: `calc(50% + ${getAddButtonOffset()}px)`,
          }}
          onClick={() => addChildNode(isCursorToTheRight)}
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      )}
    </div>
  );
}

MapNode.propTypes = {
  id: PropTypes.string,
  style: PropTypes.shape({}),
  isRootNode: PropTypes.bool,
  invert: PropTypes.bool,
  nodeName: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  addChildNode: PropTypes.func.isRequired,
  removeNode: PropTypes.func,
  focus: PropTypes.bool,
  setFocus: PropTypes.func.isRequired,
  rightBranch: PropTypes.bool.isRequired,
};

MapNode.defaultProps = {
  id: '',
  style: {},
  isRootNode: false,
  invert: false,
  removeNode: null,
  focus: false,
};
