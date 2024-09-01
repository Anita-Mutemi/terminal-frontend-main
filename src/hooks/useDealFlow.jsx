import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFundDealFlow = (
  access_token,
  uuid = 'b8a50afb-b78c-4edc-8850-f69c7cec3056',
) => {
  const [fundTimeline, setFundTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0); // State to keep track of the offset
  const [hasMore, setHasMore] = useState(true); // State to determine if there are more projects to load

  const maxProjects = 100; // Maximum number of projects to fetch

  const limit = 10; // You can make this dynamic or configurable as well

  const getFundTimeline = async () => {
    if (access_token) {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
        const response = await axios.get(
          `/v1/fund/${uuid}/dealflow?offset=${offset}&limit=${limit}`,
          config,
        );
        setFundTimeline((prevTimeline) => {
          const updatedTimeline = [...prevTimeline, ...response.data];
          // Check if the total number of projects has reached the maximum allowed
          setHasMore(
            updatedTimeline.length < maxProjects &&
              response.data.length === limit,
          );
          return updatedTimeline;
        });
        setOffset((prevOffset) => prevOffset + limit);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getFundTimeline();
  }, [uuid]);

  return { fundTimeline, loading, getMoreTimeline: getFundTimeline, hasMore };
};

export default useFundDealFlow;
