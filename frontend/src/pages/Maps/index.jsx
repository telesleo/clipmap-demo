import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { deleteMap, getDeleteMapMessage } from '../../utils/map';
import { DEFAULT_MAP_NAME } from '../../utils/constants';
import Header from '../../components/Header';
import defaultNodes from '../../utils/defaultNodes';
import ConfirmAction from '../../components/ConfirmAction';
import Footer from '../../components/Footer';
import styles from './maps.module.css';

export default function Maps({ user }) {
  const navigate = useNavigate();

  const [maps, setMaps] = useState([]);
  const [confirmDeleteMapId, setConfirmDeleteMapId] = useState(null);

  const getMapById = (id) => maps.find((map) => map.id === id);

  const getMaps = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/map`, {
      credentials: 'include',
    });
    if (response.ok) {
      const json = await response.json();
      setMaps(json);
    }
  };

  const newMap = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/map`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: JSON.stringify(defaultNodes),
      }),
    });
    if (response.status === 201) {
      const json = await response.json();
      navigate(`/map/${json.id}`);
    }
  };

  useEffect(() => {
    getMaps();
  }, []);

  const getMapName = (map) => {
    if (!map) return null;
    const nodes = JSON.parse(map?.data);
    if (!Array.isArray(nodes) || nodes.length <= 0 || !nodes[0].name) {
      return DEFAULT_MAP_NAME;
    }
    return nodes[0].name;
  };

  const redirectToMap = (id) => {
    navigate(`/map/${id}`);
  };

  const tryToDeleteMap = (event, id) => {
    event.stopPropagation();
    setConfirmDeleteMapId(id);
  };

  return (
    <>
      <Header user={user} />
      <div id={styles.maps}>
        <button type="button" className={styles.button} onClick={newMap}>
          <div className={styles['icon-and-name']}>
            <span className="material-symbols-outlined">add</span>
            Criar novo mapa
          </div>
        </button>
        {maps.map((map) => (
          <button
            type="button"
            className={`${styles.button} ${styles['existing-map-button']}`}
            onClick={() => redirectToMap(map.id)}
            key={map.id}
          >
            <div className={styles['icon-and-name']}>
              <span className="material-symbols-outlined">sticky_note_2</span>
              {getMapName(map)}
            </div>
            <button
              type="button"
              className={styles['delete-button']}
              onClick={(event) => tryToDeleteMap(event, map.id)}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </button>
        ))}
      </div>
      <ConfirmAction
        open={confirmDeleteMapId !== null}
        message={getDeleteMapMessage(
          getMapName(getMapById(confirmDeleteMapId)),
        )}
        cancel={() => setConfirmDeleteMapId(null)}
        confirm={() => {
          deleteMap(confirmDeleteMapId, getMaps);
          setConfirmDeleteMapId(null);
        }}
      />
      <Footer />
    </>
  );
}

Maps.propTypes = {
  user: PropTypes.shape({}),
};

Maps.defaultProps = {
  user: undefined,
};
