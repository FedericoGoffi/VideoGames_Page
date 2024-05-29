import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SearchContext = createContext();

export const SearchProvider = ({ children, page = 1, pageSize = 15 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);

  const performSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const url = 'https://api.rawg.io/api/games';
        const apiKey = '38f4fe9b1d3145c688f55ff81bd86f0f';

        const params = {
          key: apiKey,
          dates: '2020-01-01,2024-01-01',
          platforms: '18,1,7',
          search: searchQuery,
          page: currentPage,
          page_size: pageSize
        };

        const response = await axios.get(url, { params });
        setSearchResults(response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, currentPage, pageSize]);

  return (
    <SearchContext.Provider value={{ searchQuery, searchResults, loading, performSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  return useContext(SearchContext);
};