import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './confirm-action.module.css';
import Box from '../Box';

export default function ConfirmAction({ open, message, cancel, confirm }) {
  const [initialized, setInitialized] = useState(false);

  const handleKeyDown = (event) => {
    if (open && event.key === 'Enter') {
      confirm();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [initialized, cancel, confirm]);

  useEffect(() => {
    setInitialized(true);
  }, []);

  return (
    <Box open={open} close={cancel} className={styles['confirm-action']}>
      {message}
      <div className={styles.buttons}>
        <button type="button" onClick={cancel}>
          Cancelar
        </button>
        <button type="button" onClick={confirm}>
          Confirmar
        </button>
      </div>
    </Box>
  );
}

ConfirmAction.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
};
