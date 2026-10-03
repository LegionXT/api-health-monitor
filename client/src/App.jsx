import { useEffect, useState } from "react";
import {
  getApis,
  getStats,
  checkApi,
  deleteApi
} from "./api";
import AddApiForm from "./components/AddApiForm";

function App() {
  const [apis, setApis] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const [apisResponse, statsResponse] = await Promise.all([
        getApis(),
        getStats()
      ]);

      setApis(apisResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleApiAdded = (newApi) => {
    setApis((currentApis) => [newApi, ...currentApis]);

    setStats((currentStats) => ({
      ...currentStats,
      total: currentStats.total + 1,
      up:
        newApi.status === "UP"
          ? currentStats.up + 1
          : currentStats.up,
      down:
        newApi.status === "DOWN"
          ? currentStats.down + 1
          : currentStats.down
    }));
  };

  const handleCheck = async (id) => {
    try {
      await checkApi(id);
      await fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteApi(id);
      await fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>API Health Monitor</h1>
          <p>Monitor your APIs in real time.</p>
        </div>
      </header>

      {/* Statistics */}
      <section className="stats-grid">
        <div className="stat-card">
          <span>Total APIs</span>
          <strong>{stats.total}</strong>
        </div>

        <div className="stat-card">
          <span>APIs UP</span>
          <strong className="up-text">{stats.up}</strong>
        </div>

        <div className="stat-card">
          <span>APIs DOWN</span>
          <strong className="down-text">{stats.down}</strong>
        </div>

        <div className="stat-card">
          <span>Avg Response</span>
          <strong>{stats.averageResponseTime} ms</strong>
        </div>

        <div className="stat-card">
          <span>Avg Uptime</span>
          <strong>{stats.averageUptime}%</strong>
        </div>
      </section>

      {/* Add API */}
      <AddApiForm onApiAdded={handleApiAdded} />

      {/* API List */}
      <section className="api-section">
        <div className="section-header">
          <h2>Monitored APIs</h2>
          <span>{apis.length} APIs</span>
        </div>

        <div className="api-grid">
          {apis.map((api) => (
            <div className="api-card" key={api._id}>
              <div className="api-card-header">
                <h3>{api.name}</h3>

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

              <p className="api-url">{api.url}</p>

              <div className="api-details">
                <div>
                  <span>Response</span>
                  <strong>{api.responseTime} ms</strong>
                </div>

                <div>
                  <span>Uptime</span>
                  <strong>{api.uptime}%</strong>
                </div>

                <div>
                  <span>Method</span>
                  <strong>{api.method}</strong>
                </div>
              </div>

              {/* API Actions */}
              <div className="api-actions">
                <button onClick={() => handleCheck(api._id)}>
                  Check Now
                </button>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(api._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;