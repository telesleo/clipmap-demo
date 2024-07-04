import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './feedback-box.module.css';
import Box from '../Box';

export default function FeedbackBox({ user, open, close }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  return (
    <Box
      open={open}
      close={close}
      id={styles['feedback-box']}
      className="box-arrow-bottom-right"
    >
      <form
        id={styles['feedback-form']}
        action={`https://formsubmit.co/${process.env.REACT_APP_FEEDBACK_EMAIL}`}
        method="POST"
        name="feedback"
      >
        <input
          id={styles['feedback-box-email-input']}
          type="email"
          name="email"
          placeholder="Seu email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          required
          style={{
            display: user?.email ? 'none' : 'visible',
          }}
        />
        <textarea
          id={styles['feedback-box-message-input']}
          name="message"
          placeholder="Escreva sua sugestão ou reporte alguma correção."
          rows={6}
          value={message}
          onChange={({ target }) => setMessage(target.value)}
          required
        />
        <button
          id={styles['feedback-box-send-button']}
          type="submit"
          disabled={!email || !message}
        >
          <span className="material-symbols-outlined small-icon">send</span>
          Enviar
        </button>
        {/* {statusMessage && <p id={styles['status-message']}>{statusMessage}</p>} */}
      </form>
    </Box>
  );
}

FeedbackBox.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
  }),
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

FeedbackBox.defaultProps = {
  user: {},
};
