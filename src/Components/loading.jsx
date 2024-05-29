import React from 'react';
import styles from './loading.module.css';

const Loading = () => {
  return (
    <div id="contenedor">
      <div className={styles.contenedorloader}>
        <div className={`${styles.loader} ${location.pathname.includes('/game_details/') ? styles.loaderDetails : ''}`}></div>
      </div>
    </div>
  );
};

export default Loading;