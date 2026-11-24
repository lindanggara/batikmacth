import { useRef, useState } from "react";

const MAKS_MB = 10;

// Props: onFile(file) dipanggil saat foto valid dipilih. onCamera() opsional untuk tombol kamera.
// Kalau komponen lama memakai nama prop lain (onSelect / onChange), tetap dikenali.
export default function UploadBox({ onFile, onSelect, onChange, onCamera, disabled }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const kirim = onFile || onSelect || onChange;

  function proses(file) {
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa foto (JPG atau PNG).");
      return;
    }
    if (file.size > MAKS_MB * 1024 * 1024) {
      setError(`Ukuran foto maksimal ${MAKS_MB} MB.`);
      return;
    }
    kirim?.(file);
  }

  return (
    <section
      aria-label="Unggah foto batik"
      className="pola-ceplok rounded-[32px] p-2.5"
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); proses(e.dataTransfer.files?.[0]); }}
    >
      <div
        className={`flex flex-col items-center gap-4 rounded-3xl bg-kain px-6 py-8 ${
          drag ? "ring-4 ring-malam" : ""
        }`}
      >
        <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-nila text-malam">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
        </span>

        <button
          type="button"
          disabled={disabled}
          onClick={() => (onCamera ? onCamera() : inputRef.current?.click())}
          className="h-[52px] w-full rounded-full bg-malam text-lg font-semibold text-nila disabled:opacity-50"
        >
          Ambil Foto
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="h-12 w-full rounded-full border-2 border-nila font-semibold text-nila disabled:opacity-50"
        >
          Pilih dari Galeri
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { proses(e.target.files?.[0]); e.target.value = ""; }}
        />

        <p className="text-center text-sm text-mute">JPG atau PNG, maksimal {MAKS_MB} MB</p>
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-2 text-center text-sm font-medium text-red-800">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}