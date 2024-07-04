import React from 'react';
import PropTypes from 'prop-types';
import Maps from '../Maps';
import LocalMap from '../LocalMap';

export default function Main({ user, login }) {
  return (
    (user) ? <Maps user={user} /> : <LocalMap login={login} />
  );
}

Main.propTypes = {
  user: PropTypes.shape({}).isRequired,
  login: PropTypes.func.isRequired,
};
