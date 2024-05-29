import React, { useState, useEffect } from 'react';
import { useApi } from '../getApi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './home.module.css';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import Loading from './loading.jsx';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get('page')) || 1;
  
  const [page, setPage] = useState(initialPage);
  const pageSize = 15;

  const { data, loading } = useApi('', page, pageSize);

  useEffect(() => {
    navigate(`?page=${page}`, { replace: true });
  }, [page, navigate]);

  const nextPage = () => {
    setPage(page + 1);
    window.scrollTo(0, 0);
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToFirstPage = () => {
    setPage(1);
    window.scrollTo(0, 0);
  };

  const goToLastPage = () => {
    const totalPages = data ? Math.ceil(data.count / pageSize) : 0;
    setPage(totalPages);
    window.scrollTo(0, 0);
  };

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

  const totalPages = data ? Math.ceil(data.count / pageSize) : 0;
  let startPage = Math.max(1, page - 2);
  let endPage = Math.min(startPage + 4, totalPages);
  startPage = Math.max(1, endPage - 4);

  return (
    <div>
      {loading && <Loading />}
      {!loading && data && data.results.length > 0 && (
        <div className={styles.container}>
          {data.results.map((game) => (
            <div 
              key={game.id} 
              className={`${styles.gameContainer} ${game.metacritic <= 0 ? styles.noMetacritic : ''}`}
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
              <div className={styles.gameMenu}>
                <p>Date of Release: {game.released}</p>
                <p>Genres: {game.genres.map(genre => genre.name).join(', ')}</p>
                <Link to={`/game_details/${game.slug}`}><button>Show Details</button></Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && (!data || (data && data.results && data.results.length === 0)) && (
        <p>No data available</p>
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
            <button key={startPage + index} onClick={() => {
              setPage(startPage + index);
              window.scrollTo(0, 0);
            }} className={styles.buttonPage}>
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

export default Home;