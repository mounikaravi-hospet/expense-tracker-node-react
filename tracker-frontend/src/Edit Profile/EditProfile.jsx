import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { FaUserEdit } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "../AuthContext";

const EditProfile = () => {
  const { auth, setAuth } = useAuth();
  const [makeEditable, setMakeEditable] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleEdit = () => {
    setUser({
      name: auth.name || "",
      email: auth.email || "",
      password: auth.password || "",
    });
    setMakeEditable(true);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "/api/edit-profile",
        { ...user },
        { withCredentials: true }
      );
      setAuth(response.data.user);
      setMakeEditable(false);
      alert("Profile updated successfully");
    } catch (err) {
      alert("Error updating profile. Please try again.");
      console.error(err);
    }
  };
  return (
    <div className="container mt-5">
      <div>
        <Card>
          <Card.Header>
            <Card.Title className="d-flex align-items-center" as="h2">
              Edit Profile <FaUserEdit className="ms-2" />{" "}
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Card.Text as="h5" className="mb-4">
              Update your profile information{" "}
              <a
                style={{ cursor: "pointer", color: "blue" }}
                onClick={handleEdit}
              >
                <FaEdit className="ms-1" />
              </a>
            </Card.Text>

            {!makeEditable && (
              <Card.Text>
                <strong>Name:</strong> {auth.name}
                <br />
                <strong>Email:</strong> {auth.email}
                <br />
                <strong>password:</strong> {auth.password}
              </Card.Text>
            )}

            {makeEditable && (
              <Form className="mb-4" onSubmit={handleUpdate}>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Update
                </Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
