import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const OpenGraphMeta = () => {
  const location = useLocation();

  useEffect(() => {
    // Determine which image to use based on the route
    const isHomePage = location.pathname === "/";
    const ogImage = isHomePage ? "/preview.png" : "/Textimage.jpg";

    // Update or create og:image meta tag
    let ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (!ogImageMeta) {
      ogImageMeta = document.createElement("meta");
      ogImageMeta.setAttribute("property", "og:image");
      document.head.appendChild(ogImageMeta);
    }
    ogImageMeta.setAttribute("content", ogImage);

    // Update Twitter image as well
    let twitterImageMeta = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImageMeta) {
      twitterImageMeta = document.createElement("meta");
      twitterImageMeta.setAttribute("name", "twitter:image");
      document.head.appendChild(twitterImageMeta);
    }
    twitterImageMeta.setAttribute("content", ogImage);

    // Update og:url to reflect current page
    let ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta) {
      ogUrlMeta.setAttribute("content", window.location.href);
    }
  }, [location.pathname]);

  return null;
};

export default OpenGraphMeta;

