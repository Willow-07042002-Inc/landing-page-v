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

    // Update og:title
    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute("content", "Sign Your Clients Estate Plans Digitally");
    }

    // Update Twitter title
    let twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitleMeta) {
      twitterTitleMeta.setAttribute("content", "Sign Your Clients Estate Plans Digitally");
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

