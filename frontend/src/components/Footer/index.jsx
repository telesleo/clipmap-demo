import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FeedbackBox from '../FeedbackBox';
import styles from './footer.module.css';

export default function Footer({ user }) {
  const [feedbackBoxOpen, setFeedbackBoxOpen] = useState(false);

  const toggleFeedbackBox = (event) => {
    event.stopPropagation();
    setFeedbackBoxOpen((prevFeedbackBoxOpen) => !prevFeedbackBoxOpen);
  };

  return (
    <div id={styles.footer}>
      <p id={styles.text}>
        {'Gostou do projeto? '}
        <a
          href={process.env.REACT_APP_PAYPAL_DONATION_URL}
          target="_blank"
          rel="noreferrer"
        >
          Clique aqui e apoie!
        </a>
      </p>
      <button
        id={styles['feedback-button']}
        type="button"
        onClick={toggleFeedbackBox}
      >
        <span className="material-symbols-outlined small-icon">
          quick_phrases
        </span>
        De sugestões
      </button>
      <FeedbackBox
        user={user}
        open={feedbackBoxOpen}
        close={() => setFeedbackBoxOpen(false)}
      />
    </div>
  );
}

Footer.propTypes = {
  user: PropTypes.shape({}),
};

Footer.defaultProps = {
  user: {},
};
