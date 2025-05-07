import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";

const DisplayTransactions = ({ onTransactionsFetched }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [allTransactions, setAllTransactions] = useState([]);

  // const email = "user@user.com"; // Replace with the actual email of the logged-in user
  const { auth, logout, loading } = useAuth();
  if (loading) {
    return null;
  }
  const email = auth?.email;

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`/api/transactions/${email}`, {
        withCredentials: true,
      });
      setAllTransactions(response.data);
      setTransactions(response.data);
      if (onTransactionsFetched) {
        onTransactionsFetched(response.data);
      }
      console.log("Transactions fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  useEffect(() => {
    if (email) fetchTransactions();
  }, [email]);

  const formatedDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };
  useEffect(() => {
    fetchTransactions();
  }, []); // Fetch transactions when the component mounts

  const addTransaction = () => {
    // Logic to add a transaction
    console.log("Add Transaction button clicked");
    navigate("/add-transaction");
  };

  const sortTransactions = (criteria) => {
    const sortedTransactions = [...allTransactions].sort((a, b) => {
      if (criteria === "date") {
        console.log("Sorting by date");
        return new Date(a.date) - new Date(b.date);
      } else if (criteria === "amount") {
        console.log("Sorting by amount");
        return a.amount - b.amount;
      } else if (criteria === "category") {
        console.log("Sorting by category");
        return a.category.localeCompare(b.category);
      } else if (criteria === "type") {
        console.log("Sorting by type");
        return a.type.localeCompare(b.type);
      }
    });
    setTransactions(sortedTransactions);
  };

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortBy(selectedSort);
    sortTransactions(selectedSort);
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearch(searchValue);
    const filteredTransactions = allTransactions.filter((transaction) =>
      transaction.category.toLowerCase().includes(searchValue)
    );
    setTransactions(filteredTransactions);
  };

  const deleteTransaction = async (transactionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        await axios.delete(`/api/delete-transaction/${transactionId}`, {
          withCredentials: true,
        });
        setTransactions((prevTransactions) =>
          prevTransactions.filter(
            (transaction) => transaction.id !== transactionId
          )
        );
        fetchTransactions(); // Refresh the transactions after deletion
        console.log("Transaction deleted successfully");
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };
  return (
    <div>
      <Card className="mt-3" border="success">
        <Card.Header as="h2">Transactions</Card.Header>
        <Button
          className="btn btn-success mt-3 w-25 ms-3"
          onClick={addTransaction}
        >
          Add Transaction
        </Button>
        <Card.Body>
          <div className="d-flex gap-3 mb-3">
            <Form.Group controlId="searchCategory" className="flex-grow-1">
              <Form.Control
                type="text"
                placeholder="Search Category"
                name="searchCategory"
                onChange={handleSearchChange}
              />
            </Form.Group>

            <Form.Group controlId="type" style={{ minWidth: "200px" }}>
              <Form.Select
                aria-label="sortby"
                required
                name="sortby"
                // value={sortBy}
                onChange={handleSortChange}
              >
                <option>Sort By</option>
                <option value="date">Date</option>
                <option value="category">Category</option>
                <option value="amount">Amount</option>
                <option value="type">Type</option>
              </Form.Select>
            </Form.Group>
          </div>

          <Table striped bordered hover variant="primary" responsive="sm">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Date</th>
                <th>Notes</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.category}</td>
                  <td>{transaction.amount}</td>
                  <td
                    className={
                      transaction.type === "income".toLowerCase()
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    <b> {transaction.type} </b>
                  </td>
                  <td>{formatedDate(transaction.date)}</td>
                  <td>{transaction.note}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => deleteTransaction(transaction.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DisplayTransactions;
