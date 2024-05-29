import React, { useEffect, useState } from 'react';
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
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isGameDetails, setIsGameDetails] = useState(false);

  const { performSearch } = useSearch();
  const { selectedPlatform, setSelectedPlatform } = usePlatform();
  const { selectedGenres, setSelectedGenres } = useGenres();
  const { isAuthenticated, username, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsGameDetails(location.pathname.includes('/game_details/'));
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 90) {
        setColor(true);
      } else {
        setColor(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const detectDimension = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', detectDimension);
    return () => {
      window.removeEventListener('resize', detectDimension);
    };
  }, []);

  useEffect(() => {
    if (isGameDetails && menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [menuOpen, isGameDetails]);

  const handleLogout = () => {
    logout();
    alert('Logged out successfully!');
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

  const handleUserDropdownToggle = (e) => {
    e.stopPropagation();
    setUserDropdownOpen(!userDropdownOpen);
  };

  const renderGenresDropdown = () => (
    <ul className={styles.ulDropDownGenres} style={{ display: genreDropdownOpen ? 'block' : 'none' }}>
      {[
        { id: '1', slug: 'action', name: 'Action' },
        { id: '2', slug: 'indie', name: 'Indie' },
        { id: '3', slug: 'adventure', name: 'Adventure' },
        { id: '24', slug: 'role-playing-games-rpg', name: 'RPG' },
        { id: '10', slug: 'strategy', name: 'Strategy' },
        { id: '2', slug: 'shooter', name: 'Shooter' },
        { id: '9', slug: 'casual', name: 'Casual' },
        { id: '14', slug: 'simulation', name: 'Simulation' },
        { id: '7', slug: 'puzzle', name: 'Puzzle' },
        { id: '8', slug: 'arcade', name: 'Arcade' },
        { id: '83', slug: 'platformer', name: 'Platformer' },
        { id: '1', slug: 'racing', name: 'Racing' },
        { id: '11', slug: 'massively-multiplayer', name: 'Massively Multiplayer' },
        { id: '15', slug: 'sports', name: 'Sports' },
        { id: '4', slug: 'fighting', name: 'Fighting' },
        { id: '19', slug: 'family', name: 'Family' },
        { id: '17', slug: 'board-games', name: 'Board Games' },
        { id: '82', slug: 'educational', name: 'Educational' },
        { id: '91', slug: 'card', name: 'Card' }
      ].map(genre => (
        <li key={genre.id}>
          <Link to={`/genres/${genre.slug}`} onClick={() => handleGenresSelect(genre)}>
            {genre.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  const renderPlatformDropdown = () => (
    <ul style={{ display: platformDropdownOpen ? 'block' : 'none' }}>
      {[
        { id: '4', name: 'PC' },
        { id: '187', name: 'PlayStation' },
        { id: '186', name: 'Xbox' },
        { id: '7', name: 'Nintendo' },
        { id: '3', name: 'iOS' },
        { id: '5', name: 'Mac' },
        { id: '6', name: 'Linux' },
        { id: '21', name: 'Android' }
      ].map(platform => (
        <li key={platform.id}>
          <Link to={`/platform/${platform.name.toLowerCase()}`} onClick={() => handlePlatformSelect(platform)}>
            {platform.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`${styles.navBar} ${location.pathname.includes('/game_details/') ? styles.navBarDetails : ''} ${location.pathname === '/login' ? styles.navBarLoginRegister : ''}`}>
      <a href="/">
        <h2 className={styles.TextLogo}>GAMESINFO</h2>
      </a>

      {windowDimension.width < 767 && (
        <>
          <IoMdMenu className={styles.menuLogo} onClick={handleMenuToggle} size={25} />
          {menuOpen && (
            <div className={`${styles.menuContainer} ${location.pathname.includes('/game_details/') ? styles.menuContainerTransparent : ''} ${location.pathname.includes('/login') ? styles.menuContainerTransparent : ''}`}>
              <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  className={styles.searchInput}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className={styles.searchButton}>
                  <IoMdSearch size={20} />
                </button>
              </form>
              <div className={styles.dropdownsContainer}>
                <div className={styles.dropdown}>
                  <p onClick={() => handleDropdownToggle('genre')}>Genres<IoMdArrowDropdown /></p>
                  {renderGenresDropdown()}
                </div>
                <div className={styles.dropdown}>
                  <p onClick={() => handleDropdownToggle('platform')}>Platform<IoMdArrowDropdown /></p>
                  {renderPlatformDropdown()}
                </div>
                <div className={styles.userNavbar}>
                  {isAuthenticated ? (
                    <p onClick={handleUserDropdownToggle}>
                      <span>{username}</span><IoMdArrowDropdown />
                    </p>
                  ) : (
                    <button className={styles.Login}>
                      <Link to="/login">Login</Link>
                    </button>
                  )}
                </div>
                {userDropdownOpen && (
                  <div className={`${styles.userDropdown} ${userDropdownOpen ? styles.userDropdownOpen : ''}`}>
                    <ul>
                      <li><button onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

{windowDimension.width >= 768 && (
        <>
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

          <div className={styles.containerDropDown}>
            <ul className={styles.ulDropDown}>
              <li className={styles.liLinks}>
                <p onClick={() => handleDropdownToggle('genre')}>Genres<IoMdArrowDropdown/></p>
                {renderGenresDropdown()}
              </li>
              <li className={styles.liLinks}>
                <p onClick={() => handleDropdownToggle('platform')}>Platform<IoMdArrowDropdown/></p>
                {renderPlatformDropdown()}
              </li>
            </ul>
            <div className={styles.userNavbar}>
            <div onClick={handleMenuToggle}>
              {isAuthenticated ? (
                <p>
                  <span>{username}</span><IoMdArrowDropdown/>
                </p>
              ) : (
                <button className={styles.Login} onClick={() => navigate('/login')}>Login/Register</button>
              )}
              {isAuthenticated && menuOpen && (
                <div className={styles.UserDropDown}>
                  <ul>
                    <li><Link to='/login' onClick={handleLogout}>Log out</Link></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NavBar;