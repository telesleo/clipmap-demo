import React from 'react';
import PropTypes from 'prop-types';
import styles from './menu-list.module.css';

export default function MenuList({ buttons }) {
  return (
    <div className={styles.menu}>
      {buttons.map((button) => (
        <button
          className={[
            'discreet-button',
            styles['menu-button'],
            button.important && styles['important-button'],
          ].join(' ')}
          type="button"
          onClick={button.onClick}
        >
          <span className="material-symbols-outlined small-icon">
            {button.icon}
          </span>
          {button.title}
        </button>
      ))}
    </div>
  );
}

MenuList.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  ).isRequired,
};
