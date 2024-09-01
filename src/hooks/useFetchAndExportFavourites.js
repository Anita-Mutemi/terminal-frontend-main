import { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

export const useFetchAndExportFavourites = (token) => {
  const [favourites, setFavourites] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavourites = async () => {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(`/v1/projects/favourites`, config);
        setFavourites(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchFavourites();
    }
  }, [token]);

  const exportAsJson = () => {
    if (!favourites) {
      console.error('No data available to export');
      return;
    }

    const jsonString = JSON.stringify(favourites);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, 'favourites.json');
  };

  return { loading, error, exportAsJson };
};
