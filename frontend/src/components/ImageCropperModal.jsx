import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function ImageCropperModal({ file, onConfirm, onCancel }) {
  const [imgUrl, setImgUrl] = useState("");
  const [zoom, setZoom] = useState(1.1);
  const [geser, setGeser] = useState({ x: 0, y: 0 });
  const [seret, setSeret] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function mulaiGeser(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setSeret({ startX: clientX - geser.x, startY: clientY - geser.y });
  }

  function saatGeser(e) {
    if (!seret) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setGeser({ x: clientX - seret.startX, y: clientY - seret.startY });
  }

  function selesaiGeser() {
    setSeret(null);
  }

  function terapkanPotongan() {
    const img = imgRef.current;
    if (!img) {
      onConfirm(file);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#2B170A";
    ctx.fillRect(0, 0, 512, 512);

    const nw = img.naturalWidth || 512;
    const nh = img.naturalHeight || 512;
    const baseScale = Math.max(512 / nw, 512 / nh);
    const totalScale = baseScale * zoom;

    const drawW = nw * totalScale;
    const drawH = nh * totalScale;
    const dx = (512 - drawW) / 2 + geser.x * (512 / 240);
    const dy = (512 - drawH) / 2 + geser.y * (512 / 240);

    ctx.drawImage(img, dx, dy, drawW, drawH);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          onConfirm(file);
          return;
        }
        const croppedFile = new File([blob], `cropped-${file.name || "batik.jpg"}`, {
          type: "image/jpeg",
        });
        onConfirm(croppedFile);
      },
      "image/jpeg",
      0.92
    );
  }

  if (!file) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#2B170A]/75 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-[30px] border border-white/85 bg-[#F3F1ED]/95 p-5 text-[#432912] shadow-[0_28px_70px_rgba(32,17,7,0.45)] backdrop-blur-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#AD7559] uppercase">
              Pra-Pemrosesan Citra 1:1
            </span>
            <h3 className="mt-0.5 text-base font-extrabold text-[#432912]">
              Fokuskan Area Motif Batik
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Tutup"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#432912]/10 text-xs font-bold text-[#432912] transition hover:bg-[#AD7559] hover:text-white"
          >
            ✕
          </button>
        </div>

        <p className="mt-1 text-[11px] leading-relaxed text-[#432912]/70">
          Seret posisi gambar atau atur zoom agar pola kain memenuhi kotak pemandu.
        </p>

        {/* Kanvas Crop Kompak 240x240px agar pas di semua layar laptop */}
        <div
          onMouseDown={mulaiGeser}
          onMouseMove={saatGeser}
          onMouseUp={selesaiGeser}
          onMouseLeave={selesaiGeser}
          onTouchStart={mulaiGeser}
          onTouchMove={saatGeser}
          onTouchEnd={selesaiGeser}
          className="relative mx-auto mt-4 h-[240px] w-[240px] cursor-grab overflow-hidden rounded-[22px] border-2 border-[#AD7559] bg-[#2B170A] shadow-inner active:cursor-grabbing"
        >
          {imgUrl && (
            <img
              ref={imgRef}
              src={imgUrl}
              alt="Pratinjau potong"
              draggable={false}
              style={{
                transform: `translate(${geser.x}px, ${geser.y}px) scale(${zoom})`,
              }}
              className="h-full w-full object-cover select-none"
            />
          )}

          {/* Grid Rule of Thirds */}
          <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/25" />
            ))}
          </div>
        </div>

        {/* Kontrol Zoom + Reset */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#C59C8A]/40 bg-white/80 px-3.5 py-2">
          <span className="text-[11px] font-bold text-[#85522F]">Zoom</span>
          <input
            type="range"
            min="1"
            max="2.6"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-[#AD7559]"
          />
          <span className="w-10 text-right font-mono text-xs font-bold text-[#432912]">
            {zoom.toFixed(1)}×
          </span>
          <button
            type="button"
            onClick={() => {
              setZoom(1.1);
              setGeser({ x: 0, y: 0 });
            }}
            className="text-[10px] font-bold text-[#AD7559] hover:underline"
          >
            Reset
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onConfirm(file)}
            className="rounded-full border border-[#C59C8A]/70 bg-white px-4 py-2.5 text-xs font-bold text-[#432912] transition hover:bg-[#F3F1ED]"
          >
            Lewati Potong
          </button>
          <button
            type="button"
            onClick={terapkanPotongan}
            className="flex-1 rounded-full bg-[#AD7559] py-2.5 text-xs font-bold text-white shadow-md transition hover:brightness-105"
          >
            ✦ Potong &amp; Pindai
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}