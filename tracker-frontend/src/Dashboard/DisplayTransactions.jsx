import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";

const DisplayTransactions = ({ onTransactionsFetched }) => {
  const navigate = useNavigate();
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { auth, loading } = useAuth();
  if (loading) return null;
  const email = auth?.email;

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`/api/transactions/${email}`, {
        withCredentials: true,
      });
      setAllTransactions(response.data);
      setTransactions(response.data);
      onTransactionsFetched?.(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (email) fetchTransactions();
  }, [email]);

  const formatedDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleSortChange = (e) => {
    const criteria = e.target.value;
    setSortBy(criteria);
    const sorted = [...allTransactions].sort((a, b) => {
      if (criteria === "date") return new Date(b.date) - new Date(a.date);
      if (criteria === "amount") return a.amount - b.amount;
      if (criteria === "category") return a.category.localeCompare(b.category);
      if (criteria === "type") return a.type.localeCompare(b.type);
      return 0;
    });
    setTransactions(sorted);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    const filtered = allTransactions.filter((t) =>
      t.category.toLowerCase().includes(term)
    );
    setTransactions(filtered);
    setCurrentPage(1);
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      await axios.delete(`/api/delete-transaction/${id}`, {
        withCredentials: true,
      });
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  // calculate pagination
  const pageCount = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = transactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const paginationItems = [];
  for (let page = 1; page <= pageCount; page++) {
    paginationItems.push(
      <Pagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  return (
    <Card className="mt-3" border="success">
      <Card.Header as="h2">Transactions</Card.Header>
      <Button
        className="btn btn-success mt-3 w-25 ms-3"
        onClick={() => navigate("/add-transaction")}
      >
        Add Transaction
      </Button>
      <Card.Body>
        <div className="d-flex gap-3 mb-3">
          <Form.Control
            type="text"
            placeholder="Search Category"
            value={search}
            onChange={handleSearchChange}
            className="flex-grow-1"
          />
          <Form.Select
            value={sortBy}
            onChange={handleSortChange}
            style={{ minWidth: "200px" }}
          >
            <option value="">Sort By</option>
            <option value="date">Date</option>
            <option value="category">Category</option>
            <option value="amount">Amount</option>
            <option value="type">Type</option>
          </Form.Select>
        </div>

        <Table striped bordered hover responsive>
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
            {currentItems.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.category}</td>
                <td>{tx.amount}</td>
                <td
                  className={
                    tx.type === "income" ? "text-success" : "text-danger"
                  }
                >
                  <b>{tx.type}</b>
                </td>
                <td>{formatedDate(tx.date)}</td>
                <td>{tx.note}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteTransaction(tx.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Pagination className="justify-content-center">
          {paginationItems}
        </Pagination>
      </Card.Body>
    </Card>
  );
};

export default DisplayTransactions;
