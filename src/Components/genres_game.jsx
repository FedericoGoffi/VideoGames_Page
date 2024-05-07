import React, { useState, useEffect } from 'react';
import { useGenres } from '../Hooks/GenresContext';
import { useApi } from '../getApi';
import styles from './genres_game.module.css';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { Link, useParams } from 'react-router-dom';

const GenresGame = () => {
    const [page, setPage] = useState(1);
    const pageSize = 15;

    const { data, loading } = useApi('', page, pageSize);
    const { genresGames, selectedGenres, searchGamesByGenre } = useGenres();
    const { genreSlug } = useParams();
    const [selectedGameId, setSelectedGameId] = useState(null);

    const nextPage = () => {
      setPage(page + 1);
    };

    const prevPage = () => {
      if (page > 1) {
        setPage(page - 1);
      }
    };

    const goToFirstPage = () => {
      setPage(1);
    };

    const goToLastPage = () => {
      const totalPages = data ? Math.ceil(data.count / pageSize) : 0;
      setPage(totalPages);
    };

    useEffect(() => {
      if (genreSlug) {
        searchGamesByGenre(genreSlug, page);
      }
    }, [genreSlug, page]);

    useEffect(() => {
      console.log('Genres games:', genresGames);
    }, [genresGames]);

    const getMetacriticColor = (score) => {
      let color = '';
      let border = '';
      
      if (score >= 75) {
        color = 'green';
        border = '1px solid green';
      } else if (score >= 50) {
        color = 'orange';
        border = '1px solid orange';
      } else {
        color = 'red';
        border = '1px solid red';
      } 
    
      return { color, border };
    };

    const renderPlatformLogos = (platforms) => {

      if (!platforms || !Array.isArray(platforms)) {
        return null;
      }

      const importantPlatforms = ['pc', 'playstation', 'xbox', 'linux', 'android', 'ios', 'nintendo', 'mac'];
      
      const additionalPlatformsCount = platforms.length - importantPlatforms.length;

      return (
        <>
          {platforms.slice(0, 7).map((parentPlatform) => (
            importantPlatforms.includes(parentPlatform.platform.slug) && (
              <div
                key={parentPlatform.platform.id}
                className={`${styles.platformLogo} ${styles[parentPlatform.platform.slug]}`}
              />
            )
          ))}
          {additionalPlatformsCount > 0 && <div className={styles.platformLogo}>+{additionalPlatformsCount}</div>}
        </>
      );
    };

    const handleGameHover = (gameId) => {
      setSelectedGameId(gameId);
    };

    const totalPages = data ? Math.ceil(data.count / pageSize) : 0;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(startPage + 4, totalPages);
    startPage = Math.max(1, endPage - 4);

    return (
      <div>
        {loading && <p>Loading...</p>}
        {genresGames && genresGames.length > 0 && (
          <div className={styles.container}>
            {genresGames.map((game) => (
              <div 
                key={game.id} 
                className={`${styles.gameContainer} ${game.metacritic <= 0 ? styles.noMetacritic : ''}`}
                onMouseEnter={() => handleGameHover(game.id)}
                onMouseLeave={() => setSelectedGameId(null)}
              >
                <div
                  className={styles.gameImage}
                  style={{ backgroundImage: `url(${game.background_image})` }}
                />
                <div className={styles.containerDetails}>
                  <div className={styles.containerLogos}>
                    {renderPlatformLogos(game.parent_platforms)}
                  </div>
                  <div className={styles.containerMetacritic}>
                    <p
                      className={`${styles.metacritic} ${game.metacritic <= 0 ? styles.noMetacritic : ''}`}
                      style={{
                        color: getMetacriticColor(game.metacritic).color,
                        border: getMetacriticColor(game.metacritic).border
                      }}
                    >
                      {game.metacritic}
                    </p>
                  </div>
                </div>
                <p className={`${styles.gameTitle} ${game.metacritic <= 0 ? styles.noMetacritic : ''}`}>{game.name}</p>

                {selectedGameId === game.id && (
                  <div className={styles.gameMenu}>
                    <p>Date of Release: {game.released}</p>
                    <p>Genres: {game.genres.map(genre => genre.name).join(', ')}</p>
                    <button onClick={() => window.location.href = `/gamedetails/${game.id}`}>Show Details</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {!loading && (!data || (data && data.results && data.results.length === 0)) && (
          <p>No game available</p>
        )}
        {!loading && data && (
          <div className={styles.containerScrolling}>
            <button onClick={goToFirstPage} className={styles.arrowFirstLast}>
              <MdKeyboardDoubleArrowLeft />
            </button>
            <button onClick={prevPage} disabled={page === 1} className={styles.arrowScroll}>
              <IoIosArrowBack/>
            </button>
            {[...Array(endPage - startPage + 1)].map((_, index) => (
              <button key={startPage + index} onClick={() => setPage(startPage + index)} className={styles.buttonPage}>
                {startPage + index}
              </button>
            ))}
            <button onClick={nextPage} className={styles.arrowScroll}><IoIosArrowForward/></button>
            <button onClick={goToLastPage} className={styles.arrowFirstLast}>
              <MdKeyboardDoubleArrowRight />
            </button>
          </div>
        )}
      </div>
    );
};

export default GenresGame;