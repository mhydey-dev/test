import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the window (and the main scroll containers) to the top
 * whenever the route changes.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use auto so it feels instant on navigation.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    // Some layouts scroll inside main — best-effort reset there too.
    document
      .querySelectorAll<HTMLElement>("[data-scroll-root]")
      .forEach((el) => {
        el.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
