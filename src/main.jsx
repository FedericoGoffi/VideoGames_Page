import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { SearchProvider } from './Hooks/SearchContext.jsx';
import { PlatformProvider } from './Hooks/PlatformContext.jsx';
import { GenresProvider } from './Hooks/GenresContext.jsx';
import NavBar from './Components/navbar.jsx';
import Home from './Components/home.jsx';
import GameDetails from './Components/game_details.jsx';
import SearchGame from './Components/search_game.jsx';
import PlatformGame from './Components/platform_game.jsx';
import GenresGame from './Components/genres_game.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SearchProvider>
      <PlatformProvider>
        <GenresProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchGame />} />
            <Route path="/platform" element={<PlatformGame />} />
            <Route path="/genres" element={<GenresGame />} />
            <Route path="/game_details/:id" element={<GameDetails />} />
          </Routes>
        </GenresProvider>
      </PlatformProvider>
    </SearchProvider>
  </BrowserRouter>
);