// src/components/main-view/main-view.jsx
import React, { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
export const MainView = () => {
  const [movies] = useState([
    {
      id: 1,
      title: "The Matrix",
      description:
        "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      genre: "Action, Sci-Fi",
      director: "The Wachowskis",
      imageURL:
        "https://m.media-amazon.com/images/I/51EG732BV3L._AC_SY679_.jpg",
    },

    {
      id: 2,
      title: "The Shawshank Redemption",
      description:
        "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      genre: "Drama",
      director: "Frank Darabont",
      imageURL:
        "https://m.media-amazon.com/images/I/51NiGlapXlL._AC_SY679_.jpg",
    },
    {
      id: 3,
      title: "Interstellar",
      description:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      genre: "Adventure, Drama, Sci-Fi",
      director: "Christopher Nolan",
      imageURL:
        "https://m.media-amazon.com/images/I/91kFYg4fX3L._AC_SY679_.jpg",
    },
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  const onMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const onBackClick = () => {
    setSelectedMovie(null);
  };

  if (selectedMovie) {
    return <MovieView movie={selectedMovie} onBackClick={onBackClick} />;
  }

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
      ))}
    </div>
  );
};
