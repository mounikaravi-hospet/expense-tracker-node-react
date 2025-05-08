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
  const [isDisplayTextInput, setIsDisplayTextInput] = useState(false);

  const CATEGORY_LIST = [
    "Groceries - Costco",
    "Groceries - Walmart",
    "Groceries - Supermarket",
    "Groceries - Indian",
    "Gas",
    "Rent",
    "Internet",
    "Electricity",
    "Restaurant - Indian",
    "Restaurant - General",
    "Restaurant - Bar",
    "Recreation",
    "Travel - Accommodation",
    "Travel - Food",
    "Travel - Activities",
    "Travel - transportation",
    "Train",
    "Personal Training",
    "Monthly Savings",
    "Misc savings",
    "Other",
  ];

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setTransaction({ ...transaction, category: selectedCategory });
    setIsDisplayTextInput(selectedCategory === "Other");
  };

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
      navigate("/dashboard");
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
              <Form.Select
                aria-label="Default select example"
                required
                onChange={handleCategoryChange}
                name="category"
              >
                <option>Select Category</option>
                {CATEGORY_LIST.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {isDisplayTextInput && (
              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Other Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category"
                  required
                  onChange={handleInput}
                  name="category"
                />
              </Form.Group>
            )}

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
