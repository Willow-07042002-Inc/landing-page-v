import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const OpenGraphMeta = () => {
  const location = useLocation();

  useEffect(() => {
    // Remove og:image meta tag if it exists
    let ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (ogImageMeta) {
      ogImageMeta.remove();
    }

    // Remove Twitter image meta tag if it exists
    let twitterImageMeta = document.querySelector('meta[name="twitter:image"]');
    if (twitterImageMeta) {
      twitterImageMeta.remove();
    }

    // Update og:url to reflect current page
    let ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta) {
      ogUrlMeta.setAttribute("content", window.location.href);
    }
  }, [location.pathname]);

  return null;
};

export default OpenGraphMeta;

