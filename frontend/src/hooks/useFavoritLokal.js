import { useCallback, useEffect, useState } from "react";

const KEY = "batiklens:favorit-lokal";

function baca() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export default function useFavoritLokal() {
  const [ids, setIds] = useState(baca);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      /* penyimpanan penuh atau diblokir: abaikan */
    }
  }, [ids]);

  const toggle = useCallback(
    (id) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])),
    []
  );

  return { ids, toggle, ada: (id) => ids.includes(id) };
}