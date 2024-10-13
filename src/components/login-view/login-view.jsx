import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { Form, CardGroup, Card, CardHeader, CardTitle } from "react-bootstrap";
import "./login-view.scss"; // Import the SCSS file

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    // Prevent the default behavior of the form which is to reload the entire page
    event.preventDefault();

    const data = {
      username,
      password,
    };

    fetch("https://moro-flix-f9ac320c9e61.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login response: ", data);
        if (data.user) {
          onLoggedIn(data.user, data.token);
        } else {
          alert("No such user");
        }
      })
      .catch((e) => {
        alert("Something went wrong");
      });
  };

  return (
    <div className="login-view">
      {" "}
      {/* Wrap the CardGroup in a div with class login-view */}
      <CardGroup>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <Form onSubmit={handleSubmit}>
            <Card.Body>
              <Form.Group controlId="formUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength="3"
                  placeholder="Enter Username"
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter Password"
                />
              </Form.Group>
            </Card.Body>
            <Button variant="primary" className="mt-3" type="submit">
              Submit
            </Button>
          </Form>
        </Card>
      </CardGroup>
    </div>
  );
};
