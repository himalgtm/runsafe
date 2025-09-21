import { useEffect, useState } from "react";
import api from "../services/api.js";

export default function useNowcast(coord, { demo = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let abort = new AbortController();
    const run = async () => {
      if (!coord && !demo) { setData(null); setLoading(false); return; }
      setLoading(true);
      try {
        if (demo) {
          const r = await api.get("/air/now", { signal: abort.signal });
          setData(r.data);
        } else {
          const { lat, lon } = coord;
          const r = await api.get(`/air/now?lat=${lat}&lon=${lon}`, { signal: abort.signal });
          setData(r.data);
        }
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => abort.abort();
  }, [coord?.lat, coord?.lon, demo]);

  return { data, loading };
}
