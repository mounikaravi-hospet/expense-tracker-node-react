import React, { useState, useMemo } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
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

    let start;
    let bucketKeyFn;

    if (interval === "monthly") {
      // from Jan 1 this year through today
      start = new Date(now.getFullYear(), 0, 1);
      // bucket by month index 0–11
      bucketKeyFn = (d) => d.getMonth().toString();
    } else {
      // yearly: include all transactions
      start = new Date(0);
      // bucket by full year, e.g. "2023"
      bucketKeyFn = (d) => d.getFullYear().toString();
    }

    // sum into buckets
    const buckets = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (d >= start) {
        const key = bucketKeyFn(d);
        buckets[key] = (buckets[key] || 0) + parseFloat(t.amount || 0);
      }
    });

    // build labels
    let labels;
    if (interval === "monthly") {
      // ensure all 12 months appear
      labels = Array.from({ length: 12 }, (_, i) => i.toString());
    } else {
      // yearly: only the years present
      labels = Object.keys(buckets).sort((a, b) => Number(a) - Number(b));
    }

    // convert to display strings
    const displayLabels = labels.map((lbl) => {
      if (interval === "monthly") {
        // "0" → "Jan", etc.
        return new Date(now.getFullYear(), Number(lbl), 1)
          .toLocaleDateString("en-US", { month: "short" });
      }
      return lbl; // years
    });

    return {
      labels: displayLabels,
      datasets: [
        {
          label:
            `${interval.charAt(0).toUpperCase() + interval.slice(1)} Spending`,
          data: labels.map((lbl) => buckets[lbl] || 0),
          fill: false,
          tension: 0.3,
        },
      ],
    };
  }, [transactions, interval]);

  return (
    <Card
      border="success"
      className="mt-3 mb-3"
      style={{ width: "100%", height: "100%" }}
      id="visualize"
    >
      <Card.Header as="h4" className="d-flex align-items-center gap-3">
        Trends
        <Form.Select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
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
            borderColor: "#198754",
            backgroundColor: "#198754",
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
