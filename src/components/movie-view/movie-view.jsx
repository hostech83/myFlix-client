import React from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router"; // Import useNavigate
import { Link } from "react-router-dom";
import { SiRottentomatoes } from "react-icons/si";
import { LuPopcorn } from "react-icons/lu";
import { Container, Row, Col } from "react-bootstrap";
import {
  AiFillYoutube,
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineArrowLeft,
  AiOutlineEyeInvisible,
  AiFillEye,
} from "react-icons/ai";
import "./movie-view.scss";

export const MovieView = ({ movies, user, setUser, token }) => {
  const { movieId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const movie = movies.find((m) => m._id === movieId);

  if (!movie) {
    return <div>Movie not found</div>;
  }

  const isFavorited = user?.favoriteMovies?.includes(movie._id);
  const onWatchlist = user?.watchList?.includes(movie._id);

  const handleAddFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      alert("Please log in to add movies to your favorites.");
      return;
    }

    if (!user.favoriteMovies.includes(movie._id)) {
      fetch(
        `https://moro-flix-f9ac320c9e61.herokuapp.com/users/${user.username}/${movie._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          console.error("Error adding your movie to favorites:", error);
        });
    }
  };

  const handleRemoveFavorite = () => {
    fetch(
      `https://moro-flix-f9ac320c9e61.herokuapp.com/users/${user.username}/${movie._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error removing your movie from favorites:", error);
      });
  };

  const handleAddToWatchlist = (e) => {
    e.preventDefault();
    if (user && !user.watchList.includes(movie._id)) {
      fetch(
        `https://moro-flix-f9ac320c9e61.herokuapp.com/users/${user.username}/movies/${movie._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          console.error("Error adding your movie to watchlist:", error);
        });
    }
  };

  const handleRemoveFromWatchlist = (e) => {
    e.preventDefault();
    fetch(
      `https://moro-flix-f9ac320c9e61.herokuapp.com/users/${user.username}/movies/${movie._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.ok && response.json())
      .then((data) => setUser(data))
      .catch((error) =>
        console.error("Error removing movie from watchlist:", error)
      );
  };

  return (
    <Container className="movieviewcomponent">
      <Row className="movieviewDetails">
        <Col className="movieviewImgContainer" md={6}>
          <div className="image-wrapper">
            <img
              src={movie.imageURL}
              alt="movie poster"
              className="movieviewImg"
            />
            <div className="overlay-icons">
              {isFavorited ? (
                <AiFillHeart
                  style={{
                    color: "seagreen",
                    width: "30px",
                    height: "30px",
                  }}
                  onClick={handleRemoveFavorite}
                  className="icon"
                />
              ) : (
                <AiOutlineHeart
                  style={{ color: "seagreen", width: "30px", height: "30px" }}
                  onClick={handleAddFavorite}
                  className="icon"
                />
              )}
              {onWatchlist ? (
                <AiFillEye
                  style={{ color: "seagreen", width: "30px", height: "30px" }}
                  onClick={handleRemoveFromWatchlist}
                  className="icon"
                />
              ) : (
                <AiOutlineEyeInvisible
                  style={{ color: "seagreen", width: "30px", height: "30px" }}
                  onClick={handleAddToWatchlist}
                  className="icon"
                />
              )}
            </div>
          </div>
        </Col>

        <Col className="movieviewInfo" md={6}>
          <div className="movieviewHeader">
            <h1>{movie.title}</h1>
            <p>
              <span>{movie.genre.name}</span> •{" "}
              <span>{movie.director.name}</span>
            </p>
            <p className="movieviewRating">
              <span>
                <SiRottentomatoes color="tomato" />
                {movie.tomatoRating ? `${movie.tomatoRating.rating}%` : "N/A"}
              </span>
              <span>
                • <LuPopcorn color="red" />
                {movie.tomatoRating ? `${movie.tomatoRating.audience}%` : "N/A"}
              </span>
            </p>
          </div>

          <div className="movieviewInfo-containers">
            <span>Description: </span>
            <div className="movieviewDeets">{movie.description}</div>
          </div>

          <div className="movieviewInfo-containers">
            <span>Director: </span>
            <div className="movieviewDeets">{movie.director.name}</div>
          </div>

          <div className="btnContainer">
            <a href={movie.trailer} target="_blank" rel="noreferrer">
              <button className="trailer-button">
                Watch <AiFillYoutube className="youtube-logo" size="25px" />
                YouTube Trailer
              </button>
            </a>
            <Link
              to={`/`}
              className="d-flex justify-content-center text-decoration-none"
            >
              <button className="back-button">
                <AiOutlineArrowLeft />
                Back
              </button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

MovieView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      imageURL: PropTypes.string.isRequired,
      tomatoRating: PropTypes.shape({
        rating: PropTypes.number,
        audience: PropTypes.number,
      }),
      genre: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      description: PropTypes.string.isRequired,
      director: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  user: PropTypes.shape({
    favoriteMovies: PropTypes.arrayOf(PropTypes.string),
    watchList: PropTypes.arrayOf(PropTypes.string),
    Username: PropTypes.string.isRequired,
    username: PropTypes.string,
  }).isRequired,
  setUser: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};
