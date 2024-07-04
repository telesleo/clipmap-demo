import React from 'react';
import PropTypes from 'prop-types';
import Box from '../Box';
import MenuList from '../MenuList';
import styles from './map-menu.module.css';

export default function Menu({ buttons, open, close, id, className }) {
  return (
    <Box
      open={open}
      close={close}
      id={id}
      className={[styles.menu, className].join(' ')}
      unanchored
    >
      <MenuList buttons={buttons} />
    </Box>
  );
}

Menu.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      icon: PropTypes.string,
      onClick: PropTypes.action,
    }),
  ).isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
};

Menu.defaultProps = {
  id: undefined,
  className: undefined,
};
