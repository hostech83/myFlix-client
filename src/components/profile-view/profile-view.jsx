import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Container, Card } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";
import { useNavigate } from "react-router-dom";
import "./profile-view.scss";

export const ProfileView = ({ user, token, movies, onLoggedOut, setUser }) => {
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [birthday, setBirthday] = useState(user?.birthday || "");
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User:", user);
    if (!user || !user.username) return;

    fetch(
      `https://moro-flix-f9ac320c9e61.herokuapp.com/users/${user.username}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.username) {
          setUserData(data);
          setUsername(data.username);
          setEmail(data.email);
          setBirthday(data.birthday);
        } else {
          throw new Error("User invalid");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [token, user]);

  useEffect(() => {
    if (movies?.length > 0 && userData?.favoriteMovies?.length > 0) {
      const favMovies = movies.filter((movie) =>
        userData.favoriteMovies.includes(movie._id)
      );
      setFavoriteMovies(favMovies);
    }

    if (movies?.length > 0 && userData?.watchlist?.length > 0) {
      const watchlist = movies.filter((movie) =>
        userData.watchlist.includes(movie._id)
      );
      setWatchlistMovies(watchlist);
    }
  }, [movies, userData]);

  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(
      `https://moro-flix-f9ac320c9e61.herokuapp.com/users/${user.username}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
          birthday,
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
      `https://moro-flix-f9ac320c9e61.herokuapp.com/users/${user.username}`,
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
      `https://moro-flix-f9ac320c9e61.herokuapp.com/users/${user.username}/movies/${movieId}`,
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
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row className="account-info mt-5 mb-5">
        <Col xs={12} sm={8} md={8} lg={8}>
          <Card>
            <Card.Header>
              <h3>{userData.username}'s Current Info</h3>
            </Card.Header>
            <Card.Body>
              <p>
                <strong>Username: </strong>
                {userData.username}
              </p>
              <p>
                <strong>Email: </strong>
                {userData.email}
              </p>
              <p>
                <strong>Birthday: </strong>
                {userData.birthday}
              </p>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Header>
              <h4>Want to delete your account?</h4>
            </Card.Header>
            <Card.Body>
              <p>Careful! There's no confirmation or turning back.</p>
              <Button variant="danger" onClick={handleDeregister}>
                Delete Account
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header>
              <h3>Update your Info</h3>
            </Card.Header>
            <Card.Body>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <hr />
      <Row className="mt-3">
        <h2>{user.username}'s Favorite Movies:</h2>
        {favoriteMovies.length > 0 ? (
          favoriteMovies.map((movie) => (
            <Col
              sm={6}
              md={6}
              lg={6}
              key={movie._id}
              className="profileCard-container mb-4"
            >
              <Card>
                <Card.Body>
                  <MovieCard
                    movie={movie}
                    isFavorite={true}
                    onToggleFavorite={() => handleRemoveFavorite(movie._id)}
                  />
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>
            No favorite movies. Add some by clicking the heart icon on a movie!
          </p>
        )}
      </Row>

      <hr />
      <Row className="mt-5">
        <h2>{user.username}'s Watchlist:</h2>
        {watchlistMovies.length > 0 ? (
          watchlistMovies.map((movie) => (
            <Col
              sm={6}
              md={4}
              lg={3}
              key={movie._id}
              className="profileCard-container mb-4"
            >
              <Card>
                <Card.Body>
                  <MovieCard movie={movie} />
                </Card.Body>
              </Card>
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
