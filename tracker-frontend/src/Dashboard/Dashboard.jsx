import { useState, React } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DisplayTransactions from "./DisplayTransactions";
import Summary from "../Summary/Summary";
import Charts from "./Charts";
import Insights from "../Insights/Insights";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  return (
    <Container fluid className="py-3">
      {/* First row: transactions + summary/insights */}
      <Row className="g-4">
        <Col xs={12} md={8}>
          <DisplayTransactions
            onTransactionsFetched={(txs) => setTransactions(txs)}
          />
        </Col>
        <Col xs={12} md={4}>
          <Summary transactions={transactions} />
          <Insights transactions={transactions} />
        </Col>
      </Row>

      {/* Second row: chart full‑width */}
      <Row className="g-4 mt-3">
        <Col xs={12}>
          <Charts transactions={transactions} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
