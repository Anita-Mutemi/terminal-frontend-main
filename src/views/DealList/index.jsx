import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "styled-components";
import NavigationCard from "../../components/NavigationCard";
import { DealFlowComponent } from "./DealFlowComponent";

export const DealList = () => {
  const [data, setData] = useState([]);
  const [transformedData, setTranformedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const infiniteScrollRef = useRef(); // Reference to the InfiniteScroll component
  const { access_token } = useSelector((state) => state.user);
  const theme = useTheme();

  const fetchData = async () => {
    const config = {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    };

    setIsLoading(true);

    // Commented out the actual API call for now
    // try {
    //     const response = await axios.get(
    //         `/v1/feed/live?offset=${data.length}&limit=40`,
    //         config,
    //     );
    //     let newData = [...data, ...response.data];
    //     if (newData.length >= 380) {
    //         newData = newData.slice(0, 380);
    //         setHasMore(false);
    //     }
    //     const transformedData = newData.map((item) => ({
    //         key: item.project.uuid,
    //         funds: item.funds,
    //         project: {
    //             ...item.project,
    //             verticals: item.project.verticals || [],
    //             socials: item.project.socials || [],
    //         },
    //     }));
    //     setTranformedData(transformedData);
    //     setData(newData);

    //     if (response.data.length < 5) setHasMore(false); // when server has no more data it sends less than 10 projects
    // } catch (error) {
    //     console.error('Error fetching data:', error);
    // }

    setIsLoading(false);
  };

  useEffect(() => {
    setData([]);
    setHasMore(true);
    fetchData();
  }, []);

  return (
    <div
      id="scrollableDiv"
      style={{
        height: "100%",
        padding: "1rem",
        background: theme.body,
      }}
    >
      <NavigationCard
        showResurfacing={true}
        name={"Agent Dashboard"}
        prefix={"AI"}
        description={
          "Continuously monitor thousands of new signals from all your data sources, with lists dynamically updated to align with your thesis."
        }
      />
      <DealFlowComponent uuid={"b8a50afb-b78c-4edc-8850-f69c7cec3056"} />
    </div>
  );
};

export default DealList;
