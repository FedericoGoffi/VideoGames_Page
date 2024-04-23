import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const GenresContext = createContext();

export const GenresProvider = ({ children }) => {
    const [selectedGenres, setSelectedGenres] = useState(null);
    const [genresGames, setGenresGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const pageSize = 15;
    const apiKey = '38f4fe9b1d3145c688f55ff81bd86f0f';

    const searchGamesByGenres = async (genres, currentPage = 1) => {
        try {
            setLoading(true);
            const url = 'https://api.rawg.io/api/games';

            const params = {
                key: apiKey,
                dates: '2019-01-01,2024-03-27',
                genres: genres.id,
                page: currentPage,
                page_size: pageSize
            };

            const response = await axios.get(url, { params });
            setGenresGames(response.data.results);
        } catch (error) {
            console.error('Error fetching genres games:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedGenres) {
            searchGamesByGenres(selectedGenres);
        }
    }, [selectedGenres]);

    return (
        <GenresContext.Provider value={{ selectedGenres, setSelectedGenres, genresGames, loading, searchGamesByGenres }}>
            {children}
        </GenresContext.Provider>
    );
};

export const useGenres = () => useContext(GenresContext);