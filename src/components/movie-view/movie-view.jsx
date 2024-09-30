import { useParams } from "react-router";
import { Link } from "react-router-dom";
import React from "react";
import "./movie-view.scss";

export const MovieView = ({ movies }) => {
  const { movieId } = useParams();

  // Find the movie by its id
  const movie = movies.find((m) => m._id === movieId);

  // If the movie is not found, you might want to display an error or a message
  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div>
      <div>
        <img className="w-100" src={movie.imageURL} alt={movie.title} />
      </div>
      <div>
        <span>Description: </span>
        <span>{movie.description}</span>
      </div>
      <div>
        <span>Genre: </span>
        <span>{movie.genre.name}</span>
      </div>
      <div>
        <span>Director: </span>
        <span>{movie.director.name}</span>
      </div>
      <Link to={`/`}>
        <button className="back-button">Back</button>
      </Link>
    </div>
  );
};
