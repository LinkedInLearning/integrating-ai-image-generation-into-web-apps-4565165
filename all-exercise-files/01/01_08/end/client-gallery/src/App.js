import { useState, useEffect } from "react";
import "./App.css";
import LazyImage from "./components/Gallery";
import ImageGeneratorForm from "./components/ImageForm";

function App() {
  const [data, setData] = useState([]);
  function fetchImages() {
    // Define Request Here
    fetch("http://localhost:4000/")
      .then((res) => res.json())
      .then(data => data.images)
      .then(setData)
  }

  useEffect(() => {
    fetchImages();
  }, []);
  return (
    <div data-test-id="component-app" className="container">
      <h1>🚀 Image Gallery</h1>

      <ImageGeneratorForm />

      <div className="flexbox">
        {data.map((item, index) => (
          <LazyImage {...item} key={index} />
        ))}
      </div>
    </div>
  );
}

export default App;
