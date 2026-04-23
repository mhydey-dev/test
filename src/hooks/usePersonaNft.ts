import { useCallback, useEffect, useMemo, useState } from "react";

const LS_MINTED = "persona.nft.minted";
const LS_ADDRESS = "persona.wallet.address";

function shorten(addr: string) {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function randomHex(n: number) {
  const chars = "0123456789abcdef";
  let out = "0x";
  for (let i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function usePersonaNft() {
  const [mounted, setMounted] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [minted, setMinted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setMinted(localStorage.getItem(LS_MINTED) === "true");
      setAddress(localStorage.getItem(LS_ADDRESS));
    } catch {
      // ignore
    }
  }, []);

  const connected = !!address;

  const displayAddress = useMemo(() => {
    if (!address) return null;
    return shorten(address);
  }, [address]);

  const connect = useCallback(() => {
    const next = randomHex(40);
    setAddress(next);
    try {
      localStorage.setItem(LS_ADDRESS, next);
    } catch {
      // ignore
    }
    return next;
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    try {
      localStorage.removeItem(LS_ADDRESS);
    } catch {
      // ignore
    }
  }, []);

  const markMinted = useCallback(() => {
    setMinted(true);
    try {
      localStorage.setItem(LS_MINTED, "true");
    } catch {
      // ignore
    }
  }, []);

  const reset = useCallback(() => {
    setMinted(false);
    setAddress(null);
    try {
      localStorage.removeItem(LS_MINTED);
      localStorage.removeItem(LS_ADDRESS);
    } catch {
      // ignore
    }
  }, []);

  return {
    mounted,
    address,
    displayAddress,
    connected,
    minted,
    connect,
    disconnect,
    markMinted,
    reset,
  };
}

