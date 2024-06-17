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
    
    
  };

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
