import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiFillEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { SiRottentomatoes } from "react-icons/si";
import "./movie-card.scss";
// The MovieCard function component
export const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const [isFavorited, setIsFavorited] = useState(isFavorite);
  const [isVisible, setIsVisible] = useState(false); // New state for visibility

  useEffect(() => {
    // Sync the state with the prop whenever it changes
    setIsFavorited(isFavorite);
  }, [isFavorite]);

  const handleFavoriteMovies = (event) => {
    event.preventDefault(); // Prevent the default link behavior
    event.stopPropagation(); // Stop the click event from propagating
    if (typeof onToggleFavorite === "function") {
      console.log("Toggling favorite for movie ID:", movie._id); // Debug log
      onToggleFavorite(movie._id); // Call the parent function to toggle favorite
      setIsFavorited((prevFavorited) => !prevFavorited); // Toggle state locally
    } else {
      console.error("onToggleFavorite is not a function");
    }
  };

  const handleToggleVisibility = (event) => {
    event.preventDefault(); // Prevent the default link behavior
    event.stopPropagation(); // Stop the click event from propagating
    setIsVisible(!isVisible); // Toggle visibility state
  };

  return (
    <Card className="h-100 movieCard">
      {/* Link to open the movie */}
      <Link
        className="text-decoration-none text-dark"
        to={`/movies/${encodeURIComponent(movie._id)}`}
      >
        {/* Movie poster */}
        <Card.Img
          className="card-img-top"
          alt={movie.title}
          variant="top"
          src={movie.imageURL || "default_image_url_here"}
        />

        {/* Overlay for Favorite and Visibility Icons */}
        <Card.ImgOverlay>
          {/* Favorite Icon */}
          {isFavorited ? (
            <AiFillHeart
              style={{
                color: "red",
                width: "30px",
                height: "30px",
                fontWeight: "bold",
              }}
              onClick={handleFavoriteMovies} // Use the updated handler
              className="icon"
              title="Remove from Favorites"
            />
          ) : (
            <AiOutlineHeart
              style={{
                color: "red",
                width: "30px",
                height: "30px",
                fontWeight: "bold",
              }}
              onClick={handleFavoriteMovies} // Use the updated handler
              className="icon"
              title="Add to Favorites"
            />
          )}

          {/* Visibility Icon */}
          {isVisible ? (
            <AiFillEye
              style={{
                color: "blue",
                width: "30px",
                height: "30px",
                fontWeight: "bold",
                marginLeft: "10px", // Space between icons
              }}
              onClick={handleToggleVisibility} // Use the updated handler
              className="icon"
              title="Mark as Not Visible"
            />
          ) : (
            <AiOutlineEyeInvisible
              style={{
                color: "blue",
                width: "30px",
                height: "30px",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
              onClick={handleToggleVisibility} // Use the updated handler
              className="icon"
              title="Mark as Visible"
            />
          )}
        </Card.ImgOverlay>

        {/* Movie Details */}
        <Card.Body>
          <Card.Title className="d-inline-block text-truncate">
            {movie.title}
            <small> ({movie.releaseYear})</small>
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            <SiRottentomatoes size="17px" className="tomato" />
            {movie.tomatoRating && movie.tomatoRating.rating
              ? `${movie.tomatoRating.rating}%`
              : "N/A"}{" "}
            • {movie.genre && movie.genre.name ? movie.genre.name : "Unknown"} •{" "}
            {movie.duration ? movie.duration : "Unknown"}
          </Card.Subtitle>
        </Card.Body>
      </Link>
    </Card>
  );
};

// PropTypes for the MovieCard component
MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string, // Optional image path
    releaseYear: PropTypes.number,
    tomatoRating: PropTypes.shape({
      rating: PropTypes.number,
    }).isRequired,
    genre: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    duration: PropTypes.string,
  }).isRequired,
  isFavorite: PropTypes.bool, // Boolean to check if movie is a favorite
  onToggleFavorite: PropTypes.func.isRequired, // Function to handle toggling favorites
};
