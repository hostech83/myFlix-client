import React from "react";
import "./movie-view.scss";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <Row className="justify-content-md-center mt-5">
      <Col md={6}>
        <h2>{movie.title}</h2>
        <p>Description: {movie.description}</p>
        <p>Genre: {movie.genre.name}</p>
        <p>Director: {movie.director.name}</p>
        <Col md={6}>
          <img src={movie.imageURL} alt={movie.title} />
        </Col>
        <button
          onClick={() => onBackClick()}
          className="back-button md={3}"
          style={{ cursor: "pointer " }}
        >
          Back
        </button>
      </Col>
    </Row>
  );
};
