import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getApis, checkApi } from "../api";
import HealthHistory from "./HealthHistory";

function ApiDetails() {
  const { id } = useParams();

  const [api, setApi] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApi = async () => {
    try {
      const response = await getApis();

      const foundApi = response.data.find(
        (item) => item._id === id
      );

      setApi(foundApi);
    } catch (error) {
      console.error("Failed to load API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
  }, [id]);

  const handleCheck = async () => {
    try {
      await checkApi(id);
      await fetchApi();
    } catch (error) {
      console.error("Health check failed:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading API...</div>;
  }

  if (!api) {
    return (
      <div className="error">
        <h2>API not found</h2>
        <Link to="/">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>

      <div className="details-header">
        <div>
          <h1>{api.name}</h1>
          <p>{api.url}</p>
        </div>

        <span
          className={`status ${
            api.status === "UP"
              ? "status-up"
              : "status-down"
          }`}
        >
          {api.status}
        </span>
      </div>

      <div className="details-grid">
        <div className="stat-card">
          <span>Response Time</span>
          <strong>{api.responseTime} ms</strong>
        </div>

        <div className="stat-card">
          <span>Uptime</span>
          <strong>{api.uptime}%</strong>
        </div>

        <div className="stat-card">
          <span>Method</span>
          <strong>{api.method}</strong>
        </div>

        <div className="stat-card">
          <span>Last Checked</span>
          <strong>
            {api.lastChecked
              ? new Date(api.lastChecked).toLocaleString()
              : "Never"}
          </strong>
        </div>
      </div>

      <button
        className="check-details-button"
        onClick={handleCheck}
      >
        Check Now
      </button>

      <HealthHistory apiId={api._id} />
    </div>
  );
}

export default ApiDetails;