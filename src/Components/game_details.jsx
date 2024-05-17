import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './game_details.module.css';
import { useParams } from 'react-router-dom';
import { FaArrowDown, FaArrowUp, FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

const GameDetails = () => {
  const [gameDetails, setGameDetails] = useState(null);
  const [gameScreenshots, setGameScreenshots] = useState([]);
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState({ minimum: '', recommended: '' });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [highlightedRating, setHighlightedRating] = useState(null);
  const [visibleScreenshots, setVisibleScreenshots] = useState([0, 1, 2]);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const { slug } = useParams();

  const fetchGameDetails = async () => {
    try {
      const apiKey = '38f4fe9b1d3145c688f55ff81bd86f0f';
      const response = await axios.get(`https://api.rawg.io/api/games/${slug}`, {
        params: {
          key: apiKey
        }
      });

      setGameDetails(response.data);

      const screenshotsResponse = await axios.get(`https://api.rawg.io/api/games/${slug}/screenshots`, {
        params: {
          key: apiKey
        }
      });

      setGameScreenshots(screenshotsResponse.data.results);

      setDescription(response.data.description);

      const platform = response.data.platforms.find(platform => platform.platform.name === "PC");
      if (platform) {
        setRequirements(platform.requirements);
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
    }
  };

  useEffect(() => {
    fetchGameDetails();
  }, [slug]);

  if (!gameDetails) {
    return null;
  }

  const prevScreenshot = () => {
    const updatedScreenshots = visibleScreenshots.map(index => (index - 1 + gameScreenshots.length) % gameScreenshots.length);
    setVisibleScreenshots(updatedScreenshots);
  };

  const nextScreenshot = () => {
    const updatedScreenshots = visibleScreenshots.map(index => (index + 1) % gameScreenshots.length);
    setVisibleScreenshots(updatedScreenshots);
  };

  const prevScreenshotLarge = () => {
    setSelectedScreenshot((prevIndex) => (prevIndex - 1 + gameScreenshots.length) % gameScreenshots.length);
  };
  
  const nextScreenshotLarge = () => {
    setSelectedScreenshot((prevIndex) => (prevIndex + 1) % gameScreenshots.length);
  };

  
  const openScreenshot = (index) => {
    setSelectedScreenshot(index);
  };

  const closeScreenshot = () => {
    setSelectedScreenshot(null);
  };

  const renderScreenshots = () => {
    const openScreenshot = (index) => {
      setSelectedScreenshot(index);
    };
  
    return (
      <div className={styles.screenshotContainer}>
        <button className={styles.prevButton} onClick={prevScreenshot}>
          <FaArrowLeft />
        </button>
        {visibleScreenshots.map((screenshotIndex, index) => {
          const screenshot = gameScreenshots[screenshotIndex];
          if (screenshot && screenshot.image) {
            return (
              <div key={index} className={`${styles.screenshotWrapper} ${styles.active}`} onClick={() => openScreenshot(screenshotIndex)}>
                <img
                  src={screenshot.image}
                  alt={`Screenshot ${screenshotIndex + 1}`}
                  className={styles.screenshot}
                />
              </div>
            );
          } else {
            console.warn(`Screenshot at index ${screenshotIndex} is undefined or does not have an image property`);
            return null;
          }
        })}
        <button className={styles.nextButton} onClick={nextScreenshot}>
          <FaArrowRight />
        </button>
      </div>
    );
  };

  const renderLargeScreenshot = () => {
    if (selectedScreenshot !== null) {
      const screenshot = gameScreenshots[selectedScreenshot];
      return (
        <div className={styles.largeScreenshotOverlay}>
          <div className={styles.largeScreenshot}>
            <button className={styles.closeButtonLarge} onClick={closeScreenshot}>
              <FaTimes />
            </button>
            <img
              src={screenshot.image}
              alt={`Screenshot ${selectedScreenshot + 1}`}
              className={styles.largeImage}
            />
            <div className={styles.navigationButtons}>
              <button className={styles.prevButtonLarge} onClick={prevScreenshotLarge}>
                <FaArrowLeft />
              </button>
              <button className={styles.nextButtonLarge} onClick={nextScreenshotLarge}>
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options).toUpperCase();
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

  const renderRatingsLogos = (ratingTitle) => {
    const ratingLogoClassName = `${styles.ratingLogo} ${styles[`ratingsLogo-${ratingTitle}`]}`;
    
    return (
      <div
        key={ratingTitle}
        className={ratingLogoClassName}
      />
    );
  };

  const renderRatingTable = (rating) => {
    const totalPercentage = gameDetails.ratings.reduce((total, r) => total + r.percent, 0);
    const widthPercentage = (rating.percent / totalPercentage) * 100;

    return (
      <div
        key={rating.id}
        className={`${styles.ratingItem} ${styles[rating.title.toLowerCase()]}`}
        style={{ flexBasis: `${widthPercentage}%`, flexGrow: widthPercentage }}
        onMouseEnter={() => setHighlightedRating(rating.title.toLowerCase())}
        onMouseLeave={() => setHighlightedRating(null)}
      >
        {renderRatingsLogos(rating.title.toLowerCase())}
      </div>
    );
  };
  
  const renderRatingTables = () => {
    return (
      <div className={styles.ratingTable}>
        {gameDetails.ratings.map((rating) => renderRatingTable(rating))}
      </div>
    );
  };
  
  const renderRatingNumbers = () => {
    return (
      <div className={styles.ratingNumbers}>
        {gameDetails.ratings.map((rating) => (
          <div
            key={rating.id}
            className={`${styles.ratingNumber} ${highlightedRating === rating.title.toLowerCase() ? styles.ratingNumberHighlighted : ''}`}
          >
            <div className={`${styles.ratingCircle} ${styles[rating.title.toLowerCase()]}`}></div>
            <span className={styles.ratingName}>{rating.title} </span>
            <span className={styles.ratingCount}>{rating.count}</span>
          </div>
        ))}
      </div>
    );
  };

  const cleanDescription = (html) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className={styles.container}>
      <div className={styles.background} style={{ backgroundImage: `url(${gameDetails.background_image})` }}>
        <div className={styles.overlay}></div>
      </div>
      <div className={styles.gameInfo}>
        <div className={styles.releasedAndPlatformsContainer}>
          <p>{formatDate(gameDetails.released)}</p>
          <div className={styles.platformLogosContainer}>
            {renderPlatformLogos(gameDetails.parent_platforms)}
          </div>
        </div>
        <div className={styles.nameAndRatingContainer}>
          <h2>{gameDetails.name}</h2>
          {renderRatingTables()}
          {renderRatingNumbers()}
          {renderScreenshots()}
          {renderLargeScreenshot()}
        </div>
        <div className={styles.descriptionContainer}>
          <h2>Description:</h2>
          <p>
            {showFullDescription ? cleanDescription(description) : `${cleanDescription(description).slice(0, 200)}`}
            <button className={styles.buttonShow} onClick={toggleDescription}>
              {showFullDescription ? <FaArrowUp /> : <FaArrowDown />}
            </button>
          </p>
        </div>
        <div className={styles.requirementsContainer}>
          <div>
            <h2>Minimum Requirements:</h2>
            <p>{requirements.minimum || 'Minimum requirements not specified yet.'}</p>
          </div>
          <div>
            <h2>Recommended Requirements:</h2>
            <p>{requirements.recommended || 'Recommended requirements not specified yet.'}</p>
          </div>
        </div>
        <p>Stores: {gameDetails.stores.map(store => store.store.name).join(', ')}</p>
      </div>
    </div>
  );
};

export default GameDetails;