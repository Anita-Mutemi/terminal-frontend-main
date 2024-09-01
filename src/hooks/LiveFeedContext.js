import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const LiveFeedDataProvider = ({ children }) => {
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [shouldUpdateLiveFeed, setShouldUpdateLiveFeed] = useState(false); // Add this state

  const addSelectedFund = (fundUuid) => {
    setSelectedFunds((prevSelectedFunds) => [...prevSelectedFunds, fundUuid]);
  };
  const triggerLiveFeedUpdate = () => {
    setShouldUpdateLiveFeed((prev) => !prev);
  };
  const removeSelectedFund = (fundUuid) => {
    setSelectedFunds((prevSelectedFunds) =>
      prevSelectedFunds.filter((uuid) => uuid !== fundUuid),
    );
  };

  return (
    <DataContext.Provider
      value={{
        selectedFunds,
        addSelectedFund,
        removeSelectedFund,
        shouldUpdateLiveFeed, // Add this value
        triggerLiveFeedUpdate, // Add this function
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
