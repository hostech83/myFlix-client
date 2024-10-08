import React, { useState, useEffect } from "react"; // Removed duplicate imports
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { ProfileView } from "../profile-view/profile-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { Row, Col, Container, Spinner, Form } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
//import "slick-carousel/slick/slick.css";
//import "slick-carousel/slick/slick-theme.css";
import "./main-view.scss";

export const MainView = () => {
  // Use user and token stored in localStorage OR default to null
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser || null);
  const [token, setToken] = useState(storedToken || null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");

  // An array of all genres for the filter function
  const genres = [];
  movies.forEach((movie) => {
    if (!genres.includes(movie.genre.name)) {
      genres.push(movie.genre.name);
    }
  });

  const onLogout = () => {
    setUser(null);
    setToken(null);
    setMovies(null);
    localStorage.clear();
  };

  // Handle login
  const handleLogin = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  // Fetch movies from API
  useEffect(() => {
    if (!token) return;

    fetch("https://moro-flix-f9ac320c9e61.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setLoading(false);
      });
  }, [token]);

  // Toggle favorite movie
  const onToggleFavorite = (movieId) => {
    const favoriteMovies = user?.FavoriteMovies || [];
    const isFavorite = favoriteMovies.includes(movieId);
    const method = isFavorite ? "DELETE" : "POST";

    fetch(
      `https://moro-flix-f9ac320c9e61.herokuapp.com/users/${user.Username}/movies/${movieId}`,
      {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      })
      .catch((error) =>
        console.error("Error updating favorite movies:", error)
      );
  };

  return (
    <BrowserRouter>
      <NavigationBar user={user} onLogout={onLogout} />
      <div style={{ minHeight: "calc(100vh - 86px)" }}>
        <Row className="justify-content-md-center">
          <Routes>
            <Route
              path="/signup"
              element={
                user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <SignupView />
                  </Col>
                )
              }
            />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <LoginView onLoggedIn={handleLogin} />
                  </Col>
                )
              }
            />
            <Route
              path="/movies/:movieId"
              element={
                !user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col className="loading">
                    <Spinner animation="border" variant="success" />
                    <br />
                    Loading movie data...
                  </Col>
                ) : (
                  <Col md={8}>
                    <MovieView
                      movies={movies}
                      user={user}
                      token={token}
                      setUser={setUser}
                    />
                  </Col>
                )
              }
            />
            <Route
              path="/profile"
              element={
                !user ? (
                  <Navigate to="/login" replace />
                ) : (
                  <Col md={5}>
                    <ProfileView
                      user={user}
                      token={token}
                      setUser={setUser}
                      onLogout={onLogout}
                    />
                  </Col>
                )
              }
            />
            <Route
              path="/"
              element={
                !user ? (
                  <Navigate to="/login" replace />
                ) : loading ? (
                  <Col className="loading">
                    <Spinner animation="border" variant="success" />
                    <br />
                    Loading movie data...
                  </Col>
                ) : movies.length === 0 ? (
                  <Col className="loading">The list is empty...</Col>
                ) : (
                  <>
                    <Row>
                      <Col md={6} sm={12}>
                        <Form.Control
                          type="text"
                          placeholder="Search..."
                          className="search-bar"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </Col>
                      <Col md={6} sm={12}>
                        <Form.Select
                          className="filter-bar"
                          onChange={(e) => setFilterTerm(e.target.value)}
                          value={filterTerm}
                        >
                          <option value="">All Genres</option>
                          {genres.map((genre) => (
                            <option key={genre} value={genre}>
                              {genre}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                    <Row>
                      {movies
                        .filter((movie) => {
                          if (searchTerm === "" && filterTerm === "")
                            return movie;
                          if (
                            searchTerm &&
                            movie.title
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          ) {
                            return filterTerm
                              ? movie.genre.name
                                  .toLowerCase()
                                  .includes(filterTerm.toLowerCase())
                              : movie;
                          }
                          if (
                            filterTerm &&
                            movie.genre.name
                              .toLowerCase()
                              .includes(filterTerm.toLowerCase())
                          ) {
                            return searchTerm
                              ? movie.title
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                              : movie;
                          }
                        })
                        .map((movie) => (
                          <Col className="mb-4" key={movie._id} md={3}>
                            <MovieCard
                              movie={movie}
                              onToggleFavorite={onToggleFavorite}
                              isFavorite={user?.FavoriteMovies?.includes(
                                movie._id
                              )}
                            />
                          </Col>
                        ))}
                    </Row>
                  </>
                )
              }
            />
          </Routes>
        </Row>
      </div>
    </BrowserRouter>
  );
};
