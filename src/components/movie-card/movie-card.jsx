// src/components/movie-card/movie-card.jsx
import React from "react";

export const MovieCard = ({ movie, onClick }) => {
  return (
    <div onClick={() => onClick(movie)}>
      <h3>{movie.title}</h3>
    </div>
  );
};
