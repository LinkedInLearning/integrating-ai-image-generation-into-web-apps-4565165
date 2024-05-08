import React, { useState } from "react";

function ImageGeneratorForm() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (input === "") {
      return false;
    }

    // Define POST Request Here
    try {
      const response = await fetch("http://localhost:4000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container my-6">
      <form onSubmit={handleSubmit}>
        <div className="my-3">
          <label htmlFor="input" className="form-label">
            Input:
          </label>
          <input
            type="text"
            id="input"
            className="form-control"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={Boolean(loading || input === "")}
        >
          {loading ? "Loading..." : "Generate Image"}
        </button>
      </form>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}

export default ImageGeneratorForm;
