import { useState } from "react";
import { addApi } from "../api";

function AddApiForm({ onApiAdded }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !url.trim()) {
      setError("Name and URL are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await addApi({
        name,
        url,
        method
      });

      onApiAdded(response.data);

      setName("");
      setUrl("");
      setMethod("GET");
    } catch (err) {
      console.error(err);
      setError("Failed to add API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-api-form" onSubmit={handleSubmit}>
      <h2>Add API</h2>

      <input
        type="text"
        placeholder="API Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="url"
        placeholder="https://example.com/api"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add API"}
      </button>

      {error && <p className="form-error">{error}</p>}
    </form>
  );
}

export default AddApiForm;