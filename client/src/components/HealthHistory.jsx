import { useEffect, useState } from "react";
import { getHistory } from "../api";
import ResponseChart from "./ResponseChart";

function HealthHistory({ apiId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory(apiId);
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [apiId]);

  if (loading) {
    return <p>Loading history...</p>;
  }

  if (history.length === 0) {
    return <p>No health checks recorded yet.</p>;
  }

  return (
    <div className="health-history">
      <h4>Health Check History</h4>

      <div className="history-list">
        {history.map((check) => (
          <div className="history-item" key={check._id}>
            <span
              className={
                check.status === "UP"
                  ? "history-up"
                  : "history-down"
              }
            >
              {check.status}
            </span>

            <span>{check.responseTime} ms</span>

            <span>
              {check.statusCode || "No response"}
            </span>

            <span>
              {new Date(check.checkedAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <ResponseChart history={history} />

    </div>
  );
}

export default HealthHistory;