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
  const [interval, setInterval] = useState("weekly");

  // compute chart data whenever transactions or interval changes
  const chartData = useMemo(() => {
    const now = new Date();
    let start;
    let bucketKeyFn;

    switch (interval) {
      case "daily":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        bucketKeyFn = (d) => d.toLocaleTimeString([], { hour: "2-digit" });
        break;
      case "weekly":
        start = new Date(now);
        start.setDate(now.getDate() - 6);
        bucketKeyFn = (d) =>
          d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
        break;
      case "monthly":
        // include Jan 1 of this year through today
        start = new Date(now.getFullYear(), 0, 1);
        // bucket by month index (0=Jan…11=Dec)
        bucketKeyFn = (d) => d.getMonth().toString();
        break;
      case "yearly":
        // include all transactions
        start = new Date(0);
        // bucket by full year, e.g. "2023"
        bucketKeyFn = (d) => d.getFullYear().toString();
        break;
      default:
        start = new Date(0);
        bucketKeyFn = (d) => d.toString();
    }

    // filter & bucket
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
    } else if (interval === "yearly") {
      // sorted years from buckets
      labels = Object.keys(buckets).sort((a, b) => Number(a) - Number(b));
    } else {
      // daily/weekly: keys sorted by date value
      labels = Object.keys(buckets).sort((a, b) => {
        const da = new Date(a);
        const db = new Date(b);
        return da - db;
      });
    }

    // convert labels for display
    const displayLabels = labels.map((lbl) => {
      if (interval === "monthly") {
        // "0" -> "Jan", etc.
        return new Date(now.getFullYear(), Number(lbl), 1).toLocaleDateString(
          "en-US",
          { month: "short" }
        );
      }
      return interval === "yearly" ? lbl : lbl;
    });

    return {
      labels: displayLabels,
      datasets: [
        {
          label: `${
            interval.charAt(0).toUpperCase() + interval.slice(1)
          } Spending`,
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
          {/* <option value="daily">Daily</option>
          <option value="weekly">Weekly</option> */}
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
            borderColor: "#198754 ",
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
