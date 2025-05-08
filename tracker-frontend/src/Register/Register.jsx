import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import RegisterValidation from "./RegisterValidation";
import axios from "axios";

const Register = ({ setAuth }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = RegisterValidation(form);
    setErrors(errors);
    if (Object.values(errors).every((val) => val === "")) {
      axios
        .post("http://localhost:5555/register", form)
        .then((response) => {
          console.log("User registered successfully:", response);
          setAuth(form.name);
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error("There was an error registering the user!", error);
        });
    }
  };

  const [errors, setErrors] = useState({});
  return (
    <div>
      <Card
        className="w-50 mx-auto mt-5"
        border="success"
        style={{ width: "18rem" }}
      >
        <Card.Body>
          <Card.Title className="text-center">Register</Card.Title>
          <Card.Body>
            <Form className="w-60 mx-auto" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  onChange={handleInput}
                />
                {errors.name && (
                  <span className="text-danger">{errors.name}</span>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  onChange={handleInput}
                />
                {errors.email && (
                  <span className="text-danger">{errors.email}</span>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  onChange={handleInput}
                />
                {errors.password && (
                  <span className="text-danger">{errors.password}</span>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Enter Password Again"
                  name="confirmPassword"
                  onChange={handleInput}
                />
                {errors.confirmPassword && (
                  <span className="text-danger">{errors.confirmPassword}</span>
                )}
              </Form.Group>
              <Button variant="success" type="submit">
                {/* <Link to="/dashboard" className="text-decoration-none text-white"> */}
                Register Me!
                {/* </Link> */}
              </Button>
            </Form>
          </Card.Body>
        </Card.Body>
        <Card.Footer className="text-muted">
          Already a member?
          <Card.Link as={Link} to="/">
            Login
          </Card.Link>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Register;
