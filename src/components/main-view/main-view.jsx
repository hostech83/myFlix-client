import React, { useState, useEffect } from "react"; // Removed duplicate imports
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { ProfileView } from "../profile-view/profile-view"; // Assuming you have this component
import { NavigationBar } from "../navigation-bar/navigation-bar"; // Assuming you have this component
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [user, setUser] = useState(storedUser); // Use storedUser to initialize
  const [token, setToken] = useState(storedToken); // Use storedToken to initialize
  const [movies, setMovies] = useState([]); // Initialize state for movies

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

  // Handle login
  const handleLogin = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  //const onToggleFavorite = (movieId) => {
  // check if the movide is favorite or not
  // if is fav, send a delete to the API
  // if not, send a POST
  // method: isFav ? 'DELETE' : 'POST'
  //};

  const onToggleFavorite = (movieId) => {
    const isFavorite = user.FavoriteMovies.includes(movieId);

    // Determine the HTTP method: 'POST' to add or 'DELETE' to remove
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
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update favorite movies");
        }
        return response.json();
      })
      .then((updatedUser) => {
        // Update the user state with the new list of favorite movies
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      })
      .catch((error) => {
        console.error("Error updating favorite movies:", error);
      });
  };

  return (
    <BrowserRouter>
      <NavigationBar user={user} onLoggedOut={handleLogout} />
      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/login"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <LoginView onLoggedIn={handleLogin} />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <SignupView />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : (
                  <Col md={5}>
                    <ProfileView
                      user={user}
                      token={token}
                      setUser={setUser}
                      onLoggedOut={handleLogout} // Updated reference
                    />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/movies/:movieId"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>The list is empty</Col>
                ) : (
                  <Col md={8}>
                    <MovieView
                      movies={movies}
                      user={user}
                      token={token}
                      setUser={setUser}
                    />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>The list is empty</Col>
                ) : (
                  movies.map((movie) => (
                    <Col className="mb-4" key={movie._id} md={3}>
                      <MovieCard
                        movie={movie}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={user.favoriteMovies.find(
                          (id) => id === movie._id
                        )}
                      />
                    </Col>
                  ))
                )}
              </>
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
