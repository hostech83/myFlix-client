import React, { useState, useEffect } from "react";
//import PropTypes from "prop-types";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [user, setUser] = useState(storedUser); // Use storedUser to initialize
  const [token, setToken] = useState(storedToken); // Use storedToken to initialize
  const [movies, setMovies] = useState([]); // Initialize state for movies
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fetch movies from API
  useEffect(() => {
    if (!token) {
      return;
    }
    fetch("https://moro-flix-f9ac320c9e61.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies: ", error));
  }, [token]); // Include token in the dependency array

  const onMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const onBackClick = () => {
    setSelectedMovie(null);
  };

  // If no user is logged in, show the login form
  if (!user) {
    return (
      <Row className="justify-content-md-center">
        <Col md={12} className="text-center my-3">
          <h1>MyflixApp</h1>
        </Col>
        <Col md={5}>
          <LoginView
            onLoggedIn={(user, token) => {
              setUser(user);
              setToken(token);
              // Store user and token in localStorage
              localStorage.setItem("user", JSON.stringify(user));
              localStorage.setItem("token", token);
            }}
          />
        </Col>
        or
        <Col md={5}>
          {/* Signup Form */}
          <SignupView />
        </Col>
      </Row>
    );
  }

  // If a movie is selected, show the movie details
  if (selectedMovie) {
    return <MovieView movie={selectedMovie} onBackClick={onBackClick} />;
  }

  return (
    <div>
      {/* Logout Button */}
      <button
        variant="danger"
        onClick={() => {
          setUser(null);
          setToken(null);
          localStorage.clear(); // Clear localStorage on logout
        }}
      >
        Logout
      </button>

      {/* Show the list of movies */}
      <Row>
        {movies.map((movie) => (
          <Col className="mb-5" key={movie._id} md={3}>
            {/* Use _id as the key */}
            <MovieCard movie={movie} onMovieClick={onMovieClick} />
          </Col>
        ))}
      </Row>
    </div>
  );
};
// PropTypes for MainView if needed (depends on whether you expect props to be passed to MainView)
//MainView.propTypes = {
// movies: PropTypes.arrayOf(
// PropTypes.shape({
//_id: PropTypes.string.isRequired,
// Title: PropTypes.string.isRequired,
// Description: PropTypes.string.isRequired,
// })
// ).isRequired,
// onMovieClick: PropTypes.func.isRequired,
//};
