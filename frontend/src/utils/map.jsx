import React from 'react';
import { createRoot } from 'react-dom/client';
import * as htmlToImage from 'html-to-image';
import { DEFAULT_MAP_NAME, EXPORT_MAP_TIMEOUT } from './constants';
import MindMap from '../components/MindMap';

const deleteMap = async (id, callback) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/map/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (response.ok) {
    callback();
  }
};

const getDeleteMapMessage = (mapName) =>
  `Tem certeza que deseja deletar mapa "${mapName || DEFAULT_MAP_NAME}"?`;

const exportMap = (nodes) => {
  const container = document.createElement('div');
  container.className = 'export-div';
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<MindMap nodes={nodes} setNodes={() => {}} zoomable={false} />);
  setTimeout(() => {
    htmlToImage.toPng(container).then((dataUrl) => {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${(nodes?.length > 0 && nodes[0]?.name) || 'map'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    setTimeout(() => {
      document.body.removeChild(container);
    }, EXPORT_MAP_TIMEOUT);
  }, EXPORT_MAP_TIMEOUT);
};

export { deleteMap, getDeleteMapMessage, exportMap };
