import React, { useRef, useEffect } from "react";
import "./LazyImage.css";

function LazyImage({ url }) {
  const imageRef = useRef();
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log(entry);
        if (entry.isIntersecting) {
          setIsIntersecting(entry.isIntersecting);
        }
      },
      { rootMargin: "-300px" }
    );

    observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (isIntersecting) {
      const dataSrc = imageRef.current.getAttribute("data-src");
      if (dataSrc) {
        imageRef.current.src = dataSrc;
      }
    }
  }, [isIntersecting]);

  return (
    <img
      data-test-id="component-image"
      className="lazy-image"
      ref={imageRef}
      src={url}
      alt={url}
      data-src={url}
    />
  );
}

export default LazyImage;
