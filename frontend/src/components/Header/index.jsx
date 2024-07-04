import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProfileMenu from '../ProfileMenu';
import ConfirmAction from '../ConfirmAction';
import Menu from '../Menu';
import styles from './header.module.css';

export default function Header({ user, elements, menuButtons }) {
  const navigate = useNavigate();

  const profileMenuRef = useRef();
  const profilePictureRef = useRef();
  const menuButtonRef = useRef();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const goToMaps = () => {
    navigate('/');
  };

  const logOut = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/logout`;
  };

  const deleteAccount = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (response.ok) {
      logOut();
    }
  };

  const tryToDeleteAccount = () => {
    setConfirmDeleteAccount(true);
  };

  const toggleProfileMenu = (event) => {
    event.stopPropagation();
    setProfileMenuOpen((prevProfileMenuOpen) => !prevProfileMenuOpen);
  };

  const toggleMenu = (event) => {
    event.stopPropagation();
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };

  const getElement = (element) => {
    if (element.type === 'select') {
      return (
        <div>
          <select
            value={element.value}
            onChange={({ target }) => element.setValue(target.value)}
          >
            {element.options.map((option) => (
              <option value={option.name}>{option.name}</option>
            ))}
          </select>
        </div>
      );
    }
    return (
      <button
        type="button"
        onClick={element.onClick}
        disabled={element.disabled}
      >
        <span className="material-symbols-outlined small-icon">
          {element.icon}
        </span>
        {element.title}
      </button>
    );
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileMenuOpen &&
        !profileMenuRef.current?.contains(event.target) &&
        !profilePictureRef.current?.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [profileMenuOpen]);

  return (
    <>
      <div id={styles.header}>
        <div id={styles.logo}>
          <img
            id={styles['logo-image']}
            src="/images/clipmap-logo.png"
            alt="ClipMap Logo"
          />
        </div>
        <div id={styles['save-button-and-profile-picture']}>
          {menuButtons?.length > 0 && (
            <>
              <button
                ref={menuButtonRef}
                id={styles['more-button']}
                type="button"
                onClick={toggleMenu}
              >
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
              <Menu
                open={menuOpen}
                close={() => setMenuOpen(false)}
                buttons={menuButtons}
                id={styles['header-menu']}
                className="box-arrow-top"
              />
            </>
          )}
          {elements.map((element) => getElement(element))}
          {user && (
            <button
              type="button"
              ref={profilePictureRef}
              id={styles['profile-picture-button']}
              onClick={toggleProfileMenu}
            >
              <img
                id={styles['profile-picture']}
                src={user.profilePictureUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
              />
            </button>
          )}
          {user && (
            <ProfileMenu
              ref={profileMenuRef}
              open={profileMenuOpen}
              close={() => setProfileMenuOpen(false)}
              user={user}
              logOut={logOut}
              goToMaps={goToMaps}
              deleteAcount={tryToDeleteAccount}
            />
          )}
        </div>
      </div>
      {user && (
        <ConfirmAction
          open={confirmDeleteAccount}
          message={`Tem certeza que deseja deletar a conta "${
            user.name
          }"? Todos os mapas associados a essa conta serão perdidos.`}
          cancel={() => setConfirmDeleteAccount(false)}
          confirm={() => {
            deleteAccount();
            setConfirmDeleteAccount(false);
          }}
        />
      )}
    </>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    profilePictureUrl: PropTypes.string,
  }).isRequired,
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      icon: PropTypes.string,
      onClick: PropTypes.action,
      disabled: PropTypes.disabled,
    }),
  ),
  menuButtons: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      icon: PropTypes.string,
      onClick: PropTypes.action,
      important: PropTypes.bool,
    }),
  ),
};

Header.defaultProps = {
  elements: [],
  menuButtons: [],
};
