import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const tampilkanToast = useCallback((pesan, tipe = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, pesan, tipe }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ tampilkanToast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-5 bottom-20 z-50 flex flex-col gap-2.5 lg:bottom-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-white/40 bg-[#432912]/92 px-4 py-3 text-xs font-bold text-white shadow-[0_14px_30px_rgba(43,23,10,0.28)] backdrop-blur-xl"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#AD7559] text-[10px]">
              {t.tipe === "error" ? "!" : "✦"}
            </span>
            <span>{t.pesan}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx || { tampilkanToast: () => {} };
}