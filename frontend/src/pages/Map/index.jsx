import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { deleteMap, exportMap, getDeleteMapMessage } from '../../utils/map';
import Header from '../../components/Header';
import MindMap from '../../components/MindMap';
import defaultNodes from '../../utils/defaultNodes';
import ConfirmAction from '../../components/ConfirmAction';
import Footer from '../../components/Footer';
import styles from './map.module.css';

export default function Map({ user }) {
  const navigate = useNavigate();

  const { id } = useParams();

  const [mapVisibility, setMapVisibility] = useState();
  const [nodes, setNodes] = useState(null);
  const [savedMap, setSavedMap] = useState(
    JSON.stringify({
      defaultNodes,
      visibility: 'private',
    }),
  );
  const [confirmDeleteMap, setConfirmDeleteMap] = useState(false);

  const getNode = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/map/${id}`, {
      credentials: 'include',
    });
    if (response.status === 200) {
      const json = await response.json();
      setMapVisibility(json.visibility);
      const parsedData = JSON.parse(json.data);
      setNodes(parsedData);
      setSavedMap(
        JSON.stringify({ data: parsedData, visibility: json.visibility }),
      );
    }
  };

  const saveNode = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/map/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        data: JSON.stringify(nodes),
        visibility: mapVisibility,
      }),
    });
    if (response.status === 200) {
      setSavedMap(JSON.stringify({ data: nodes, visibility: mapVisibility }));
    }
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      saveNode();
    }
  };

  const tryToDeleteMap = (event) => {
    event.stopPropagation();
    console.log('tryToDeleteMap called');
    setConfirmDeleteMap(true);
  };

  useEffect(() => {
    console.log('confirmDeleteMap state:', confirmDeleteMap);
  }, [confirmDeleteMap]);

  const redirectToMainPage = () => {
    navigate('/');
  };

  useEffect(() => {
    if (user) {
      getNode();
    }
  }, [user, id]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [nodes, mapVisibility]);

  const saved =
    JSON.stringify({ data: nodes, visibility: mapVisibility }) === savedMap;

  return (
    <>
      <div id={styles.map}>
        <Header
          user={user}
          elements={[
            {
              type: 'button',
              title: saved ? 'Salvo' : 'Salvar mapa',
              icon: saved ? 'check' : 'save',
              onClick: saveNode,
              disabled: saved,
            },
          ]}
          menuButtons={[
            {
              title: 'Exportar',
              icon: 'image',
              onClick: () => exportMap(nodes),
            },
            {
              title: 'Deletar',
              icon: 'delete',
              onClick: tryToDeleteMap,
              important: true,
            },
          ]}
        />
        {nodes && (
          <MindMap
            nodes={nodes}
            setNodes={setNodes}
            zoomable
            className={styles['mind-map']}
          />
        )}
        <ConfirmAction
          open={confirmDeleteMap}
          message={getDeleteMapMessage(nodes?.length > 0 && nodes[0]?.name)}
          cancel={() => setConfirmDeleteMap(false)}
          confirm={() => {
            deleteMap(id, redirectToMainPage);
            setConfirmDeleteMap(false);
          }}
        />
      </div>
      <Footer />
    </>
  );
}

Map.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};
