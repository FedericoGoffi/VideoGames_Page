import React, { useEffect, useState, useRef } from 'react';
import { useSearch } from '../Hooks/SearchContext.jsx';
import { usePlatform } from '../Hooks/PlatformContext.jsx';
import { useGenres } from '../Hooks/GenresContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import styles from './navbar.module.css';
import { IoMdMenu, IoMdSearch, IoMdArrowDropdown } from 'react-icons/io';

const NavBar = () => {
  const [color, setColor] = useState(false);
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const navRef = useRef(null);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { performSearch } = useSearch();
  const { selectedPlatform, setSelectedPlatform } = usePlatform();
  const { selectedGenres, setSelectedGenres } = useGenres();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = () => {
    if (window.scrollY >= 90) {
      setColor(true);
    } else {
      setColor(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const detectDimension = () => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', detectDimension);

    return () => {
      window.removeEventListener('resize', detectDimension);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
    navigate('/search');
  };

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    setPlatformDropdownOpen(false);
    navigate('/platform');
  };

  const handleGenresSelect = (genres) => {
    setSelectedGenres(genres);
    setGenreDropdownOpen(false);
    navigate('/genres');
  };

  const handleDropdownToggle = (dropdown) => {
    if (dropdown === 'platform') {
      setPlatformDropdownOpen(!platformDropdownOpen);
    } else if (dropdown === 'genre') {
      setGenreDropdownOpen(!genreDropdownOpen);
    }
  };

  return (
    <div ref={navRef} className={`${styles.navBar} ${color ? styles.navBarScroll : ''}`}>
      <a href="/">
        <h2 className={styles.TextLogo}>GAMESINFO</h2>
      </a>

      <form onSubmit={handleSearchSubmit} className={styles.SearchForm}>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          className={styles.SearchInput}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className={styles.SearchButton}><IoMdSearch/></button>
      </form>

      {windowDimension.width > 800 && (
        <div className={styles.containerDropDown}>
          <ul className={styles.ulDropDown}>
          <li className={styles.liLinks}>
              <p onClick={() => handleDropdownToggle('genre')}>Genres<IoMdArrowDropdown/></p>
              <ul style={{ display: genreDropdownOpen ? 'block' : 'none' }}>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '4' })}>Action</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '51' })}>Indie</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '3' })}>Adventure</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '5' })}>RPG</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '10' })}>Strategy</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '2' })}>Shooter</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '9' })}>Casual</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '14' })}>Simulation</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '7' })}>Puzzle</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '8' })}>Arcade</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '83' })}>Platformer</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '1' })}>Racing</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '11' })}>Massively Multiplayer</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '15' })}>Sports</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '4' })}>Fighting</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '19' })}>Family</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '17' })}>Board Games</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '82' })}>Educational</Link></li>
                <li><Link to='/genres' onClick={() => handlePlatformSelect({ id: '91' })}>Card</Link></li>
              </ul>
            </li>
            <li className={styles.liLinks}>
              <p onClick={() => handleDropdownToggle('platform')}>Platform<IoMdArrowDropdown/></p>
              <ul style={{ display: platformDropdownOpen ? 'block' : 'none' }}>
                <li><Link to='/platform' onClick={() => handlePlatformSelect({ id: '4' })}>PC</Link></li>
                <li><Link to='/platform' onClick={() => handlePlatformSelect({ id: '187' })}>PlayStation</Link></li>
                <li><Link to='/platform' onClick={() => handlePlatformSelect({ id: '186' })}>Xbox</Link></li>
                <li><Link to='/platform' onClick={() => handlePlatformSelect({ id: '7' })}>Nintendo</Link></li>
                <li><Link to='/platform' onClick={() => handlePlatformSelect({ id: '3' })}>iOS</Link></li>
                <li><Link to='/platform' onClick={() => handlePlatformSelect({ id: '5' })}>Mac</Link></li>
                <li><Link to='/platform' onClick={() => handlePlatformSelect({ id: '6' })}>Linux</Link></li>
                <li><Link to='/platform' onClick={() => handlePlatformSelect({ id: '21' })}>Android</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      )}

      {windowDimension.width < 800 && (
        <IoMdMenu
          className={styles.MenuLogo}
          onClick={() => setMenuOpen(!menuOpen)}
          size={25}
        />
      )}

      {windowDimension.width < 800 && menuOpen && (
        <div className={styles.containerSearch}>
          <form className={styles.SearchForm}>
            <input
              type="text"
              placeholder="Buscar..."
              className={styles.SearchInput}
            />
            <button type="submit" className={styles.SearchButton}>
              <IoMdSearch size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NavBar;