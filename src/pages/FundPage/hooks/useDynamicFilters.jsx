import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const useDynamicFilters = (uuid) => {
  const { access_token } = useSelector((state) => state.user);
  const [filters, setFilters] = useState({
    verticals: [],
    competing_spaces: [],
    product_types: [],
    customer_segments: [],
  });
  const [filteredData, setFilteredData] = useState([]); // Store the filtered data
  const [loading, setLoading] = useState(false);

  // Fetch filter options from server
  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://api.arbmintel.com/v1/fund/${uuid}/dealflow/tags`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        setFilters(response.data.filters);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [uuid, access_token]);

  // Function to apply filters and search
  const applyFilters = async (searchQuery, selectedFilters) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://api.arbmintel.com/v1/fund/${uuid}/dealflow/filter?offset=0&limit=100&q=${encodeURIComponent(
          searchQuery,
        )}`,
        selectedFilters,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      setFilteredData(response.data); // Store the response data as the filtered data
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { filters, loading, filteredData, applyFilters };
};

export default useDynamicFilters;
