import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const DisplayTransactions = ({ onTransactionsFetched }) => {
  const navigate = useNavigate();
  const { auth, loading } = useAuth();
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  if (loading) return null;
  const email = auth?.email;

  useEffect(() => {
    if (!email) return;
    axios
      .get(`/api/transactions/${email}`, { withCredentials: true })
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setAllTransactions(sorted);
        setTransactions(sorted);
        onTransactionsFetched?.(sorted);
      })
      .catch(console.error);
  }, [email]);

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
    await axios.delete(`/api/delete-transaction/${id}`, {
      withCredentials: true,
    });
    // refetch or remove locally:
    setTransactions((tx) => tx.filter((t) => t.id !== id));
  };

  // pagination logic
  const pageCount = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = transactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Card className="h-auto">
      <Card.Header as="h2">Transactions</Card.Header>
      <Card.Body>
        <Row className="mb-3 g-2">
          <Col xs={4} s={4} md={4} lg={4}>
            <Button
              variant="success"
              onClick={() => navigate("/add-transaction")}
            >
              Add Transaction
            </Button>
          </Col>
        </Row>
        <Row className="mb-3 g-2">
          <Col xs={12} md={8}>
            <Form.Control
              type="text"
              placeholder="Search Category"
              value={search}
              onChange={handleSearchChange}
            />
          </Col>
          <Col xs={12} md={4}>
            <Form.Select value={sortBy} onChange={handleSortChange}>
              <option value="">Sort By</option>
              <option value="date">Date</option>
              <option value="category">Category</option>
              <option value="amount">Amount</option>
              <option value="type">Type</option>
            </Form.Select>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table striped bordered hover variant="success">
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
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
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
        </div>

        <Pagination className="justify-content-center" size="md">
          {Array.from({ length: pageCount }, (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </Card.Body>
    </Card>
  );
};

export default DisplayTransactions;
