// src/components/movie-card/movie-card.jsx
import React from "react";
import PropTypes from "prop-types"; // Import PropTypes

// The MovieCard function component
export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <div onClick={() => onMovieClick(movie)}>
      <h3>{movie.title}</h3>
    </div>
  );
};

// Here is where we define all the props constraints for the MovieCard
MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    // Add other required properties here
  }).isRequired,
  onMovieClick: PropTypes.func.isRequired,
};
