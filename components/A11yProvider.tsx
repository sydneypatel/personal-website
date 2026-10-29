"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type A11y = {
  /** True when the visitor asked for less motion (OS setting or the site toggle). */
  calm: boolean;
  contrast: boolean;
  setCalm: (v: boolean) => void;
  setContrast: (v: boolean) => void;
};

const Ctx = createContext<A11y>({ calm: false, contrast: false, setCalm: () => {}, setContrast: () => {} });

const KEY = "sp-a11y";

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const [calm, setCalmState] = useState(false);
  const [contrast, setContrastState] = useState(false);

  // Initial values: saved choice first, otherwise the OS reduced-motion setting.
  useEffect(() => {
    let saved: { calm?: boolean; contrast?: boolean } = {};
    try {
      saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch {}
    const osCalm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    setCalmState(saved.calm ?? osCalm);
    setContrastState(saved.contrast ?? false);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = calm ? "reduce" : "full";
    root.dataset.contrast = contrast ? "high" : "normal";
  }, [calm, contrast]);

  const persist = useCallback((next: { calm: boolean; contrast: boolean }) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const setCalm = useCallback(
    (v: boolean) => {
      setCalmState(v);
      persist({ calm: v, contrast });
    },
    [contrast, persist],
  );
  const setContrast = useCallback(
    (v: boolean) => {
      setContrastState(v);
      persist({ calm, contrast: v });
    },
    [calm, persist],
  );

  return <Ctx.Provider value={{ calm, contrast, setCalm, setContrast }}>{children}</Ctx.Provider>;
}

export const useA11y = () => useContext(Ctx);
