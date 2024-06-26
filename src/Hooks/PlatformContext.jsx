import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PlatformContext = createContext();

export const PlatformProvider = ({ children, page = 1, pageSize = 15 }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [platformGames, setPlatformGames] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchGamesByPlatform = async (platform, currentPage) => {
    setLoading(true);
    try {
      const url = 'https://api.rawg.io/api/games';
      const apiKey = '38f4fe9b1d3145c688f55ff81bd86f0f';
  
      const params = {
        key: apiKey,
        dates: '2020-01-01,2024-01-01',
        platforms: platform.id,
        page: currentPage,
        page_size: pageSize
      };
  
      const response = await axios.get(url, { params });
      setPlatformGames(response.data.results);
    } catch (error) {
      console.error('Error fetching platform games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPlatform) {
      searchGamesByPlatform(selectedPlatform, page);
    }
  }, [selectedPlatform, page]);

  useEffect(() => {
    console.log("selectedPlatform changed to:", selectedPlatform);
  }, [selectedPlatform]);

  return (
    <PlatformContext.Provider value={{ selectedPlatform, setSelectedPlatform, platformGames, setPlatformGames, searchGamesByPlatform, loading }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => useContext(PlatformContext);