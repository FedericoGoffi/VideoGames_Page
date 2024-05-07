import React, { useEffect, useState, useRef } from 'react';
import { useSearch } from '../Hooks/SearchContext.jsx';
import { usePlatform } from '../Hooks/PlatformContext.jsx';
import { useGenres } from '../Hooks/GenresContext.jsx';
import { useUser } from '../Hooks/UserContext.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { performSearch } = useSearch();
  const { selectedPlatform, setSelectedPlatform } = usePlatform();
  const { selectedGenres, setSelectedGenres } = useGenres();
  const { isAuthenticated, username, logout } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setMenuOpen(false);
    }
  }, [isAuthenticated]);

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

  const handleLogout = () => {
    logout();
    alert('Log Out successfully!');
  };

  const handleUserDropdownToggle = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
    navigate(`/search/${searchQuery}`);
  };

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    setPlatformDropdownOpen(false);
    navigate(`/platform/${platform.name.toLowerCase()}`);
  };

  const handleGenresSelect = (genre) => {
    setSelectedGenres(genre);
    setGenreDropdownOpen(false);
    navigate(`/genres/${genre.slug.toLowerCase()}`);
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleDropdownToggle = (dropdown) => {
    if (dropdown === 'platform') {
      setPlatformDropdownOpen(!platformDropdownOpen);
    } else if (dropdown === 'genre') {
      setGenreDropdownOpen(!genreDropdownOpen);
    }
  };
  
  return (
    <div className={`${styles.navBar} ${location.pathname === '/login' || location.pathname === '/register' ? styles.navBarLoginRegister : ''}`}>
      <a href="/">
        <h2 className={styles.TextLogo}>GAMESINFO</h2>
      </a>

      <form onSubmit={handleSearchSubmit} className={styles.SearchForm}>
        <input
          type="text"
          placeholder="Search..."
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
              <ul className={styles.ulDropDownGenres} style={{ display: genreDropdownOpen ? 'block' : 'none' }}>
                <li><Link to={`/genres/action`} onClick={() => handleGenresSelect({ id: '1', slug: 'action' })}>Action</Link></li>
                <li><Link to={`/genres/indie`} onClick={() => handleGenresSelect({ id: '2', slug: 'indie' })}>Indie</Link></li>
                <li><Link to={`/genres/adventure`} onClick={() => handleGenresSelect({ id: '3', slug: 'adventure' })}>Adventure</Link></li>
                <li><Link to={`/genres/role-playing-games-rpg`} onClick={() => handleGenresSelect({ id: '24', slug: 'role-playing-games-rpg' })}>RPG</Link></li>
                <li><Link to={`/genres/strategy`} onClick={() => handleGenresSelect({ id: '10', slug: 'strategy' })}>Strategy</Link></li>
                <li><Link to={`/genres/shooter`} onClick={() => handleGenresSelect({ id: '2', slug: 'shooter' })}>Shooter</Link></li>
                <li><Link to={`/genres/casual`} onClick={() => handleGenresSelect({ id: '9', slug: 'casual' })}>Casual</Link></li>
                <li><Link to={`/genres/simulation`} onClick={() => handleGenresSelect({ id: '14', slug: 'simulation' })}>Simulation</Link></li>
                <li><Link to={`/genres/puzzle`} onClick={() => handleGenresSelect({ id: '7', slug: 'puzzle' })}>Puzzle</Link></li>
                <li><Link to={`/genres/arcade`} onClick={() => handleGenresSelect({ id: '8', slug: 'arcade' })}>Arcade</Link></li>
                <li><Link to={`/genres/platformer`} onClick={() => handleGenresSelect({ id: '83', slug: 'platformer' })}>Platformer</Link></li>
                <li><Link to={`/genres/racing`} onClick={() => handleGenresSelect({ id: '1', slug: 'racing' })}>Racing</Link></li>
                <li><Link to={`/genres/massively-multiplayer`} onClick={() => handleGenresSelect({ id: '11', slug: 'massively-multiplayer' })}>Massively Multiplayer</Link></li>
                <li><Link to={`/genres/sports`} onClick={() => handleGenresSelect({ id: '15', slug: 'sports' })}>Sports</Link></li>
                <li><Link to={`/genres/fighting`} onClick={() => handleGenresSelect({ id: '4', slug: 'fighting' })}>Fighting</Link></li>
                <li><Link to={`/genres/family`} onClick={() => handleGenresSelect({ id: '19', slug: 'family' })}>Family</Link></li>
                <li><Link to={`/genres/board-games`} onClick={() => handleGenresSelect({ id: '17', slug: 'board-games' })}>Board Games</Link></li>
                <li><Link to={`/genres/educational`} onClick={() => handleGenresSelect({ id: '82', slug: 'educational' })}>Educational</Link></li>
                <li><Link to={`/genres/card`} onClick={() => handleGenresSelect({ id: '91', slug: 'card' })}>Card</Link></li>
              </ul>
            </li>
            <li className={styles.liLinks}>
              <p onClick={() => handleDropdownToggle('platform')}>Platform<IoMdArrowDropdown/></p>
                <ul style={{ display: platformDropdownOpen ? 'block' : 'none' }}>
                  <li><Link to={`/platform/pc`} onClick={() => handlePlatformSelect({ id: '4', name: 'PC' })}>PC</Link></li>
                  <li><Link to={`/platform/playstation`} onClick={() => handlePlatformSelect({ id: '187', name: 'PlayStation' })}>PlayStation</Link></li>
                  <li><Link to={`/platform/xbox`} onClick={() => handlePlatformSelect({ id: '186', name: 'Xbox' })}>Xbox</Link></li>
                  <li><Link to={`/platform/nintendo`} onClick={() => handlePlatformSelect({ id: '7', name: 'Nintendo' })}>Nintendo</Link></li>
                  <li><Link to={`/platform/ios`} onClick={() => handlePlatformSelect({ id: '3', name: 'iOS' })}>iOS</Link></li>
                  <li><Link to={`/platform/mac`} onClick={() => handlePlatformSelect({ id: '5', name: 'Mac' })}>Mac</Link></li>
                  <li><Link to={`/platform/linux`} onClick={() => handlePlatformSelect({ id: '6', name: 'Linux' })}>Linux</Link></li>
                  <li><Link to={`/platform/android`} onClick={() => handlePlatformSelect({ id: '21', name: 'Android' })}>Android</Link></li>
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

      <div className={styles.userNavbar}>
        <div onClick={handleMenuToggle}>
          {isAuthenticated ? (
            <p>
              <span>{username}</span><IoMdArrowDropdown/>
            </p>
          ) : (
            <button className={styles.Login} onClick={() => navigate('/login')}>Log in</button>
          )}
        </div>
        {isAuthenticated && (
          <ul style={{ display: menuOpen ? 'block' : 'none' }}>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default NavBar;