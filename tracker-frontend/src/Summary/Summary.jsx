// src/Summary/Summary.jsx
import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";

const Summary = ({ transactions = [] }) => {
  const [interval, setInterval] = useState("weekly");
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    if (!transactions.length) {
      setSummary({ totalTransactions: 0, totalAmount: 0 });
      return;
    }

    const now = new Date();
    let cutoff;

    switch (interval) {
      case "daily":
        cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "weekly":
        cutoff = new Date(now);
        cutoff.setDate(now.getDate() - 6);
        break;
      case "monthly":
        cutoff = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "yearly":
        cutoff = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        cutoff = new Date(0);
    }

    const filtered = transactions.filter((t) => {
      const d = new Date(t.date);
      return d >= cutoff;
    });

    const totalTransactions = filtered.length;
    const totalAmount = filtered.reduce(
      (sum, t) => sum + parseFloat(t.amount || 0),
      0
    );

    setSummary({ totalTransactions, totalAmount });
  }, [interval, transactions]);

  return (
    <Card border="success" className="mt-3">
      <Card.Header as="h4" className="d-flex align-items-center gap-5">
        Summary
        <Form.Select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="ms-auto w-auto"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </Form.Select>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          <strong>Total Transactions:</strong> {summary.totalTransactions}
        </Card.Text>
        <Card.Text>
          <strong>Total Amount Spent:</strong> ${summary.totalAmount.toFixed(2)}
        </Card.Text>
        <Button variant="success" className="w-100 mt-3" as="a" href="#visualize">
            See the trend
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Summary;
