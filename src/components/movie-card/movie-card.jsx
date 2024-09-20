// src/components/movie-card/movie-card.jsx
import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Button, Card } from "react-bootstrap";

// The MovieCard function component
export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={movie.image} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.director.name}</Card.Text>
        <Button onClick={() => onMovieClick(movie)} variant="link">
          Open
        </Button>
      </Card.Body>
    </Card>
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
