import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultNodes from '../../utils/defaultNodes';
import LOCAL_STORAGE_ID from '../../utils/localStorage';

export default function SaveLocalMap() {
  const navigate = useNavigate();

  const createNewMapWithLocalMap = async () => {
    const nodes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ID));
    const response = await fetch(`${process.env.REACT_APP_API_URL}/map`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: JSON.stringify(nodes),
      }),
    });
    if (response.status === 201) {
      localStorage.setItem(LOCAL_STORAGE_ID, JSON.stringify(defaultNodes));
      const json = await response.json();
      navigate(`/map/${json.id}`);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    createNewMapWithLocalMap();
  }, []);
}
