import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const AddTransaction = () => {
  const [transaction, setTransaction] = useState({});
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleInput = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!auth) {
      alert("You must be logged in to add a transaction.");
      navigate("/");
    }

    try {
      console.log(transaction);
      const response = await axios.post("/api/add-transaction", transaction, {
        withCredentials: true,
      });
      console.log(response.data);
      alert("Transaction added successfully!");
      setTransaction({}); // Reset the form
    } catch (error) {
      console.error(error);
      alert("Failed to add transaction.");
    }
  };
  return (
    <>
      <Card className="w-50 mx-auto mt-5" border="success">
        <Card.Header>
          <Card.Title>Add Transaction</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Salary/Utilities/Foodsd"
                required
                onChange={handleInput}
                name="category"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="$"
                required
                onChange={handleInput}
                name="amount"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Select
                aria-label="Default select example"
                required
                onChange={handleInput}
                name="type"
              >
                <option value="">Select Type</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="date">
              <Form.Label>Transaction Date</Form.Label>
              <Form.Control
                type="date"
                required
                onChange={handleInput}
                name="date"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={handleInput}
                name="notes"
              />
            </Form.Group>
            <Button type="submit" variant="success">
              Done
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default AddTransaction;
