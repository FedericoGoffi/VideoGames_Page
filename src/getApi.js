import { useState, useEffect } from 'react';
import axios from 'axios';

export const useApi = (searchQuery, page = 5, pageSize = 15) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = 'https://api.rawg.io/api/games';
        const apiKey = '38f4fe9b1d3145c688f55ff81bd86f0f';

        const params = {
          key: apiKey,
          dates: '2020-01-01,2024-01-01',
          platforms: '18,1,7',
          search: searchQuery,
          page: page,
          page_size: pageSize
        };

        const response = await axios.get(url, { params });

        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, page, pageSize]);

  return { data, loading };
};