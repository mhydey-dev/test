import { useCallback, useEffect, useState } from "react";

const LS_KEY = "credit.token.minted";

export function useCreditToken() {
  const [mounted, setMounted] = useState(false);
  const [minted, setMinted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setMinted(localStorage.getItem(LS_KEY) === "true");
    } catch {
      // ignore
    }
  }, []);

  const markMinted = useCallback(() => {
    setMinted(true);
    try {
      localStorage.setItem(LS_KEY, "true");
    } catch {
      // ignore
    }
  }, []);

  const reset = useCallback(() => {
    setMinted(false);
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { mounted, minted, markMinted, reset };
}
