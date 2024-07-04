import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './box.module.css';

export default function Box({
  children,
  open,
  close,
  unanchored,
  id,
  className,
  style,
}) {
  const dialogRef = useRef();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    const handleOutsideClick = (event) => {
      if (open && !dialogRef.current?.contains(event.target)) {
        close();
      }
    };
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, close]);

  return (
    <dialog
      ref={dialogRef}
      id={id}
      open={open}
      className={
        styles.box +
        (className ? ` ${className}` : '') +
        (unanchored ? ` ${styles.unanchored}` : '')
      }
      style={{
        visibility: open ? 'visible' : 'hidden',
        ...style,
      }}
    >
      {children}
    </dialog>
  );
}

Box.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  unanchored: PropTypes.bool,
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.shape({}),
};

Box.defaultProps = {
  unanchored: false,
  id: undefined,
  className: undefined,
  style: {},
};
