import { useEffect, useState } from "react";
import { getApis } from "./api";

function App() {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const response = await getApis();
        setApis(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load APIs");
      } finally {
        setLoading(false);
      }
    };

    fetchApis();
  }, []);

  if (loading) {
    return <h2>Loading APIs...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>API Health Monitor</h1>

      {apis.length === 0 ? (
        <p>No APIs are being monitored.</p>
      ) : (
        apis.map((api) => (
          <div key={api._id}>
            <h2>{api.name}</h2>
            <p>{api.url}</p>
            <p>Status: {api.status}</p>
            <p>Response Time: {api.responseTime} ms</p>
            <p>Uptime: {api.uptime}%</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;