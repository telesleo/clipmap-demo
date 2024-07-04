import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Header from '../../components/Header';
import MindMap from '../../components/MindMap';
import Footer from '../../components/Footer';
import defaultNodes from '../../utils/defaultNodes';
import LOCAL_STORAGE_ID from '../../utils/localStorage';
import styles from './local-map.module.css';

export default function LocalMap({ login }) {
  const getNodesFromLocalStorage = () =>
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_ID)) || defaultNodes;

  const [nodes, setNodes] = useState(getNodesFromLocalStorage());

  const saveToLocalStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_ID, JSON.stringify(nodes));
  };

  useEffect(() => {
    saveToLocalStorage();
  }, [nodes]);

  const hasMapToSave =
    (nodes[0].name?.length || 0) > 0 || (nodes[0].children?.length || 0) > 0;

  return (
    <>
      <div id={styles['local-map']}>
        <Header
          elements={[
            {
              title: hasMapToSave ? 'Fazer login e salvar mapa' : 'Fazer login',
              icon: 'login',
              onClick: hasMapToSave
                ? () => login('/save-local-map')
                : () => login(),
            },
          ]}
        />
        <MindMap
          nodes={nodes}
          setNodes={setNodes}
          zoomable
          className={styles['mind-map']}
        />
      </div>
      <Footer />
    </>
  );
}

LocalMap.propTypes = {
  user: PropTypes.shape({}).isRequired,
  login: PropTypes.func.isRequired,
};
