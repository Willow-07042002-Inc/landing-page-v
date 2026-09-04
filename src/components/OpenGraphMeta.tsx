import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const OpenGraphMeta = () => {
  const location = useLocation();

  useEffect(() => {
    // Update og:url to reflect current page; titles and og:image live in
    // index.html and stay as-is (crawlers read the static HTML anyway).
    let ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta) {
      ogUrlMeta.setAttribute("content", window.location.href);
    }
  }, [location.pathname]);

  return null;
};

export default OpenGraphMeta;

