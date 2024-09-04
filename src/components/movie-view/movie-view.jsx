import React from "react";

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <div>
        <h2>{movie.title}</h2>
        <p>Description: {movie.description}</p>
        <p>Genre: {movie.genre.name}</p>
        <p>Director: {movie.director.name}</p>
        <img src={movie.imageURL} alt={movie.title} />
      </div>
      <button onClick={() => onBackClick()}>Back</button>
    </div>
  );
};
