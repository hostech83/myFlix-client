import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";
import { useNavigate } from "react-router-dom";

export const ProfileView = ({ user, token, movies, onLoggedOut, setUser }) => {
  const [username, setUsername] = useState(user.Username || "");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(user.Email || "");
  const [birthday, setBirthday] = useState(user.Birthday || "");
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [userData, setUserData] = useState(null); // New state for user data
  const navigate = useNavigate();

  // Fetch all users and filter for the current user
  useEffect(() => {
    fetch("https://moro-flix-f9ac320c9e61.herokuapp.com/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const currentUser = data.find((u) => u.Username === user.Username);
        setUserData(currentUser);
        setUsername(currentUser.Username);
        setEmail(currentUser.Email);
        setBirthday(currentUser.Birthday);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [token, user.Username]);

  useEffect(() => {
    if (movies?.length > 0 && userData?.FavoriteMovies?.length > 0) {
      const favMovies = movies.filter((movie) =>
        userData.FavoriteMovies.includes(movie._id)
      );
      setFavoriteMovies(favMovies);
    }

    if (movies?.length > 0 && userData?.Watchlist?.length > 0) {
      const watchlist = movies.filter((movie) =>
        userData.Watchlist.includes(movie._id)
      );
      setWatchlistMovies(watchlist);
    }
  }, [movies, userData]);

  // Handle profile update
  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(
      `https://moro-flix-f9ac320c9e61.herokuapp.com/users/${user.Username}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: username,
          Password: password,
          Email: email,
          Birthday: birthday,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        alert("Profile updated successfully");
      })
      .catch((error) => alert("Error updating profile: " + error));
  };

  // Handle removing user
  const handleDeregister = () => {
    fetch(
      `https://moro-flix-f9ac320c9e61.herokuapp.com/users/${user.Username}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(() => {
        localStorage.clear();
        onLoggedOut();
        navigate("/");
      })
      .catch((error) => alert("Error deregistering: " + error));
  };

  const handleRemoveFavorite = (movieId) => {
    fetch(
      `https://moro-flix-f9ac320c9e61.herokuapp.com/users/${user.Username}/movies/${movieId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(() => {
        const updatedFavorites = favoriteMovies.filter(
          (m) => m._id !== movieId
        );
        setFavoriteMovies(updatedFavorites);
        alert("Movie removed from favorites");
      })
      .catch((error) => alert("Error removing movie: " + error));
  };

  if (!userData) {
    return <div>Loading...</div>; // Display loading state until user data is fetched
  }

  return (
    <Container>
      {/* Account Info and Update Section */}
      <Row className="account-info mt-5 mb-5">
        {/* Left Column - Current Info */}
        <Col md={6}>
          <div className="profile-info ">
            <h3>{userData.Username}'s Current Info</h3>
            <p>
              <strong>Username: </strong>
              {userData.Username}
            </p>
            <p>
              <strong>Email: </strong>
              {userData.Email}
            </p>
            <p>
              <strong>Birthday: </strong>
              {userData.Birthday}
            </p>
          </div>

          {/* Delete Account Section */}
          <div className="delete-account mt-4">
            <h4>Want to delete your account?</h4>
            <p>Careful! There's no confirmation or turning back.</p>
            <Button variant="danger" onClick={handleDeregister}>
              Delete Account
            </Button>
          </div>
        </Col>

        {/* Right Column - Update Info */}
        <Col md={6}>
          <h3>Update your Info</h3>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={3}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter new email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBirthday" className="mb-3">
              <Form.Label>Birthday:</Form.Label>
              <Form.Control
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </Form.Group>

            <Button variant="success" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Favorite Movies Section */}
      <hr />
      <Row className="mt-3">
        <h2>{userData.Username}'s Favorite Movies:</h2>
        {favoriteMovies.length > 0 ? (
          favoriteMovies.map((movie) => (
            <Col
              sm={6}
              md={4}
              lg={3}
              key={movie._id}
              className="profileCard-container mb-4"
            >
              <MovieCard
                movie={movie}
                isFavorite={true}
                onToggleFavorite={() => handleRemoveFavorite(movie._id)}
              />
            </Col>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>
            No favorite movies. Add some by clicking the heart icon on a movie!
          </p>
        )}
      </Row>

      {/* Watchlist Section */}
      <hr />
      <Row className="mt-5">
        <h2>{userData.Username}'s Watchlist:</h2>
        {watchlistMovies.length > 0 ? (
          watchlistMovies.map((movie) => (
            <Col
              sm={6}
              md={4}
              lg={3}
              key={movie._id}
              className="profileCard-container mb-4"
            >
              <MovieCard movie={movie} />
            </Col>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>
            No movies in your watchlist. Add some by clicking the eye icon on a
            movie!
          </p>
        )}
      </Row>
    </Container>
  );
};
