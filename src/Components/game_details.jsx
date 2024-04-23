import React from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../getApi';
import styles from './game_details.module.css'; 

const GameDetails = () => {
  const { id } = useParams();
  const { data, loading } = useApi();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!data) {
    return <div>No se ha proporcionado ningún dato</div>;
  }

  // Busca el juego por su ID
  const juegoSeleccionado = data.results.find((game) => String(game.id) === id);

  // Si no se encuentra el juego, muestra el siguiente mensaje de error
  if (!juegoSeleccionado) {
    return <div>No se ha encontrado el juego con ID {id}</div>;
  }

  return (
    <div className={styles.container}>
      <div 
        key={juegoSeleccionado.id}
        className={styles.gameImage}
        style={{ backgroundImage: `url(${juegoSeleccionado.background_image})` }}>
      </div>
      <div className={styles.gameContainer}>
        <p className={styles.gameTitle}>{juegoSeleccionado.name}</p>
        <p className={styles.releaseDate}>Fecha de lanzamiento: {juegoSeleccionado.released}</p>
        <p className={styles.platforms}>
          Plataformas: {juegoSeleccionado.parent_platforms.map((platform) => platform.platform.name).join(', ')}
        </p>
        <p className={styles.genres}>Géneros: {juegoSeleccionado.genres.map((genre) => genre.name).join(', ')}</p>
        <p className={styles.metacritic}>Metacritic: {juegoSeleccionado.metacritic}</p>
      </div>
    </div>
  );
};

export default GameDetails;