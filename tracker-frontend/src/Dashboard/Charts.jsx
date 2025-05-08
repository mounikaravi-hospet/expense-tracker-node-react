import React, { useState, useMemo } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Charts = ({ transactions = [] }) => {
  const [interval, setInterval] = useState("monthly");

  const chartData = useMemo(() => {
    const now = new Date();
    let start, bucketKeyFn;

    if (interval === "monthly") {
      start = new Date(now.getFullYear(), 0, 1);
      bucketKeyFn = d => d.getMonth().toString();
    } else {
      start = new Date(0);
      bucketKeyFn = d => d.getFullYear().toString();
    }

    const buckets = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      if (d >= start) {
        const key = bucketKeyFn(d);
        buckets[key] = (buckets[key] || 0) + parseFloat(t.amount || 0);
      }
    });

    const labels =
      interval === "monthly"
        ? Array.from({ length: 12 }, (_, i) => i.toString())
        : Object.keys(buckets).sort((a, b) => +a - +b);

    const displayLabels = labels.map(lbl =>
      interval === "monthly"
        ? new Date(now.getFullYear(), +lbl, 1).toLocaleDateString("en-US", { month: "short" })
        : lbl
    );

    return {
      labels: displayLabels,
      datasets: [
        {
          label: `${interval.charAt(0).toUpperCase() + interval.slice(1)} Spending`,
          data: labels.map(lbl => buckets[lbl] || 0),
          fill: false,
          tension: 0.3,
        },
      ],
    };
  }, [transactions, interval]);

  return (
    <Card className="h-100" id="visualize">
      <Card.Header as="h4" className="d-flex align-items-center">
        Trends
        <Form.Select
          value={interval}
          onChange={e => setInterval(e.target.value)}
          className="ms-auto w-auto"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </Form.Select>
      </Card.Header>
      <Card.Body style={{ position: "relative", height: "300px" }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            backgroundColor: "green",
            borderColor: "#14A44D",
            plugins: { legend: { position: "top" } },
            scales: {
              x: {
                title: {
                  display: true,
                  text: interval === "monthly" ? "Month" : "Year",
                },
              },
              y: { title: { display: true, text: "Amount ($)" } },
            },
          }}
        />
      </Card.Body>
    </Card>
  );
};

export default Charts;
