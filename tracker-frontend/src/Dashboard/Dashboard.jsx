import { useState, React } from "react";
import DisplayTransactions from "./DisplayTransactions";
import Summary from "../Summary/Summary";
import Charts from "./Charts";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  return (
    <div>
      <div className="ms-3 me-3 mt-3 d-flex gap-4">
        <div className="flex-grow-1">
          <DisplayTransactions
            onTransactionsFetched={(txs) => setTransactions(txs)}
          />
        </div>
        <div style={{ width: "25%" }}>
          <Summary transactions={transactions} />
        </div>
      </div>

      <div className="ms-3 me-3 mt-3 d-flex gap-4">
        <Charts transactions={transactions} />
      </div>
    </div>
  );
};

export default Dashboard;
