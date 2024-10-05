import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

// The MovieCard function component
export const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const [isFavorited, setIsFavorited] = useState(isFavorite);

  useEffect(() => {
    setIsFavorited(isFavorite); // Sync the state with the prop whenever it changes
  }, [isFavorite]);

  const handleFavoriteMovies = () => {
    if (typeof onToggleFavorite === "function") {
      onToggleFavorite(movie._id); // Call the parent function to toggle favorite
      setIsFavorited(!isFavorited); // Optimistic UI update
    } else {
      console.error("onToggleFavorite is not a function");
    }
  };

  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={movie.imageURL || "default_image_url_here"}
      />
      {/* Properly closed Card.Body */}
      <Card.Body className="mb-3 mt-3">
        <Card.Title>{movie.title}</Card.Title>
        {/*<Card.Text>{movie.director.name}</Card.Text>*/}
        {/* Link to open the movie */}
        <Link to={`/movies/${encodeURIComponent(movie._id)}`}>
          <Button variant="link">Open</Button>
        </Link>
        {/* Favorite button */}
        <Button
          variant={isFavorited ? "danger" : "secondary"}
          onClick={handleFavoriteMovies}
          className="mt-2"
        >
          {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
        </Button>
      </Card.Body>
    </Card>
  );
};

// PropTypes for the MovieCard component
MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    director: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    image: PropTypes.string, // Optional, might be undefined
  }).isRequired,
  isFavorite: PropTypes.bool, // Boolean to check if movie is a favorite
  onToggleFavorite: PropTypes.func.isRequired, // Function to handle toggling favorites
};
