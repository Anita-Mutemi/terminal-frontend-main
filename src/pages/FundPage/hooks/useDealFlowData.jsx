import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const useDealFlowData = (uuid, form) => {
  const { access_token } = useSelector((state) => state.user);
  const [isFiltered, setIsFiltered] = useState(false); // Added state for tracking if filters are applied
  const [searchQuery, setSearchQuery] = useState('');

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    company_types: [],
    // competing_space: [],
    customer_segments: [],
    product_types: [],
    // verticals: [],
  });
  const [selectedFilterValues, setSelectedFilterValues] = useState([]);

  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const inputRef = useRef();

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`/v1/fund/${uuid}/dealflow/tags`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        setFilters(response.data.filters);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, [uuid, access_token]);

  // Function to fetch data (initial, more data, or filtered)
  const fetchData = async (
    searchQuery = '',
    selectedFilters = [],
    loader = true,
    reset = false,
  ) => {
    loader && setLoading(true);
    try {
      const response = await axios.post(
        `https://api.arbmintel.com/v1/fund/${uuid}/dealflow/filter?offset=${
          reset ? 0 : offset
        }&limit=${limit}&q=${encodeURIComponent(searchQuery)}`,
        selectedFilters,
        { headers: { Authorization: `Bearer ${access_token}` } },
      );

      if (reset) {
        setData(response.data); // Reset data with the new set
        setOffset(limit); // Set offset for the next fetch
      } else {
        setData((prevData) => [...prevData, ...response.data]); // Append new data
        setOffset((prevOffset) => prevOffset + limit); // Increment offset
      }

      setHasMore(response.data.length === limit); // Check if more data is available
    } catch (error) {
      console.error(error);
    } finally {
      loader && setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch initial data
  }, [access_token]); // Removed isFiltered from dependencies

  // Function to apply filters
  const applyFilters = async (searchQuery, selectedFilters, loader, reset) => {
    setIsFiltered(true); // Set to true when applying filters
    setSelectedFilterValues(selectedFilters); // Update selected filter values
    fetchData(searchQuery, selectedFilters, loader, reset);
  };

  // Function to clear filters
  const clearFilters = () => {
    const input = document.querySelector('#searchInput');
    inputRef.current.input.value = '';
    input.value = '';
    inputRef.current.input.defaultValue = '';
    form.resetFields();
    setSearchQuery('');
    setIsFiltered(false); // Set to false when clearing filters
    setSelectedFilterValues([]); // Clear selected filter values
    setOffset(0); // Reset offset
    fetchData('', [], true, true); // Fetch initial data
  };

  return {
    data,
    filters,
    selectedFilterValues,
    searchQuery,
    setSearchQuery,
    loading,
    hasMore,
    inputRef,
    applyFilters,
    isFiltered,
    clearFilters,
  };
};

export default useDealFlowData;
