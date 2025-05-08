import React, { use, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/api/login", form, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("User logged in successfully:", response);
        // const username = response.data[0].name;
        // sessionStorage.setItem("username", username);

        setAuth({
          name: response.data.user.name,
          email: response.data.user.email,
          password: response.data.user.password,
          id: response.data.user.id,
        });
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Login failed", error);
      });
  };
  return (
    <div>
      <Card
        className="w-50 mx-auto mt-5"
        border="success"
        style={{ width: "18rem" }}
      >
        <Card.Body>
          <Card.Title className="text-center ">Login</Card.Title>
          <Card.Body>
            <Form className="w-60 mx-auto" onSubmit={handleSubmit}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  onChange={handleInput}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  onChange={handleInput}
                />
              </Form.Group>
              <Button type="submit" variant="success">
                {/* <Link  className="text-decoration-none text-white"> */}
                Login
                {/* </Link> */}
              </Button>
            </Form>
          </Card.Body>
        </Card.Body>
        <Card.Footer className="text-muted">
          New here?
          <Card.Link as={Link} to="/register">
            Register
          </Card.Link>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Login;
