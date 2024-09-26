import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MovieCard } from "../movie-card/movie-card";

export const ProfileView = ({ user, token, movies, onLoggedOut, setUser }) => {
  const [username, setUsername] = useState(user.Username || "");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(user.Email || "");
  const [birthday, setBirthday] = useState(user.Birthday || "");
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (movies.length > 0) {
      const favMovies = movies.filter((movie) =>
        user.FavoriteMovies.includes(movie._id)
      );
      setFavoriteMovies(favMovies);
    }
  }, [movies, user.FavoriteMovies]);

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
  return (
    <div>
      <h2>Profile</h2>
      <Form onSubmit={handleUpdate}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Birthday</Form.Label>
          <Form.Control
            type="date"
            value={birthday.split("T")[0]} // Split to handle the datetime string
            onChange={(e) => setBirthday(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-2">
          Update Profile
        </Button>
        <Button variant="danger" onClick={handleDeregister} className="mt-2">
          Deregister
        </Button>
      </Form>

      <h3 className="mt-4">Favorite Movies</h3>
      <Row>
        {favoriteMovies.length === 0 ? (
          <Col>You have no favorite movies</Col>
        ) : (
          favoriteMovies.map((movie) => (
            <Col key={movie._id} md={3} className="mb-4">
              <MovieCard
                movie={movie}
                isFavorite={true}
                onToggleFavorite={handleRemoveFavorite}
              />
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};
