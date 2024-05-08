import React, { useState, useRef } from "react";

const FileUploader = () => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const inputRef = useRef(null);
  const [input, setInput] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);

  const handleChange = (e) => {
    setInput(e.target.value);
    setPreview(e.target.value);
    inputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (preview === null) {
      return false;
    }
    
    // request data

    const request_data = {
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What’s in this image?" },
            {
              type: "image_url",
              image_url: {
                "url": preview,
              },
            },
          ],
        },
      ],
    }


    try {
      // API request
      const response = await fetch("https://api.openai.com/v1/chat/completions", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(request_data),
      }); 
      const data = await response.json();
      setContent(data.choices[0].message.content)
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoading(false);
      setInput(null);
      inputRef.current.value = "";
    }
  };
  return (
    <div className="container mt-5">
      <h2 className="text-primary">Try GPT-4 Vision</h2>
      <hr />
      <div className="d-flex">
        <form onSubmit={handleSubmit} style={{ width: "30%" }}>
          <div className="mt-5">
            <label htmlFor="textInput">Enter Image URL:</label>
            <input
              type="text"
              ref={inputRef}
              className="mt-2"
              style={{ width: "99%" }}
              id="textInput"
              value={input}
              onChange={handleChange}
            />
          </div>
          <button className="mt-3 float-end" type="submit">
            Run!
          </button>
        </form>
        <div className="mx-5" style={{ width: "30%" }}>
          {preview && (
            <img src={preview} alt="preview" style={{ width: "100%" }} />
          )}
        </div>
      </div>
      <div>
        <hr />
        {loading ? <p className="text-info">Loading...</p> : <p>{content}</p>}
      </div>
    </div>
  );
};

export default FileUploader;
