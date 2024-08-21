// src/components/movie-view/movie-view.jsx
import React from "react";

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <div>
        <h2>{movie.title}</h2>
        <p>Description: {movie.description}</p>
        <p>Genre: {movie.genre}</p>
        <p>Director: {movie.director}</p>
        <img src={movie.imageURL} alt={movie.title} />
      </div>
      <button onClick={() => onBackClick()}>Back</button>
    </div>
  );
};
