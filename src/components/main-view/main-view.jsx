// src/components/main-view/main-view.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([]); // Initialize state for movies
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fetch movies from API
  useEffect(() => {
    fetch("https://moro-flix-f9ac320c9e61.herokuapp.com/movies")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies: ", error));
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const onMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const onBackClick = () => {
    setSelectedMovie(null);
  };

  if (selectedMovie) {
    return <MovieView movie={selectedMovie} onBackClick={onBackClick} />;
  }

  console.log(movies);

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard
          key={movie._id} // Use _id as the key
          movie={movie}
          onMovieClick={onMovieClick}
        />
      ))}
    </div>
  );
};

// PropTypes for MainView if needed (it depends on whether you expect props to be passed to MainView)
MainView.propTypes = {
  // If you're passing movies as a prop to MainView, uncomment the next line
  // movies: PropTypes.arrayOf(PropTypes.shape({
  //   _id: PropTypes.string.isRequired,
  //   Title: PropTypes.string.isRequired,
  //   Description: PropTypes.string.isRequired,
  // })).isRequired,
  // If you're passing the onMovieClick handler as a prop, uncomment the next line
  // onMovieClick: PropTypes.func.isRequired,
};
