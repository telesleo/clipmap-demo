import React from 'react';
import PropTypes from 'prop-types';
import styles from './profile-menu.module.css';
import Box from '../Box';
import MenuList from '../MenuList';

export default function ProfileMenu({
  ref,
  open,
  close,
  user,
  logOut,
  goToMaps,
  deleteAcount,
}) {
  return (
    <Box
      ref={ref}
      id={styles['profile-menu']}
      className="box-arrow-top-right"
      open={open}
      close={close}
    >
      <h2 id={styles['user-name']}>{user.name}</h2>
      <MenuList
        buttons={[
          {
            title: 'Meus mapas',
            onClick: goToMaps,
            icon: 'list',
          },
          {
            title: 'Sair da conta',
            onClick: logOut,
            icon: 'logout',
          },
          {
            title: 'Deletar conta',
            onClick: deleteAcount,
            icon: 'delete',
            important: true,
          },
        ]}
      />
    </Box>
  );
}

ProfileMenu.propTypes = {
  ref: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  logOut: PropTypes.func.isRequired,
  goToMaps: PropTypes.func.isRequired,
  deleteAcount: PropTypes.func.isRequired,
};
