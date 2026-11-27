import { useEffect, useRef, useState } from "react";

function pertajamKanvas(ctx, w, h, kekuatan = 0.25) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const src = imgData.data;
  const copy = new Uint8ClampedArray(src);

  for (let y = 1; y < h - 1; y++) {
    const row = y * w;
    for (let x = 1; x < w - 1; x++) {
      const idx = (row + x) * 4;
      for (let c = 0; c < 3; c++) {
        const tengah = copy[idx + c] * 5;
        const tetangga =
          copy[((y - 1) * w + x) * 4 + c] +
          copy[((y + 1) * w + x) * 4 + c] +
          copy[(row + (x - 1)) * 4 + c] +
          copy[(row + (x + 1)) * 4 + c];
        const tajam = tengah - tetangga;
        src[idx + c] = Math.min(255, Math.max(0, copy[idx + c] * (1 - kekuatan) + tajam * kekuatan));
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

export default function ImageCropperModal({ file, onBatal, onSelesai }) {
  const [imgUrl, setImgUrl] = useState(null);
  const [zoom, setZoom] = useState(1.15);
  const [geser, setGeser] = useState({ x: 0, y: 0 });
  const [seret, setSeret] = useState(null);
  const [hdAktif, setHdAktif] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!file) return;
    const u = URL.createObjectURL(file);
    setImgUrl(u);
    setZoom(1.15);
    setGeser({ x: 0, y: 0 });
    return () => URL.revokeObjectURL(u);
  }, [file]);

  if (!file || !imgUrl) return null;

  function mulaiGeser(e) {
    const titik = e.touches ? e.touches[0] : e;
    setSeret({ startX: titik.clientX - geser.x, startY: titik.clientY - geser.y });
  }

  function saatGeser(e) {
    if (!seret) return;
    const titik = e.touches ? e.touches[0] : e;
    setGeser({
      x: Math.max(-140, Math.min(140, titik.clientX - seret.startX)),
      y: Math.max(-140, Math.min(140, titik.clientY - seret.startY)),
    });
  }

  function hentiGeser() {
    setSeret(null);
  }

  function terapkanPotongan() {
    try {
      const img = imgRef.current;
      if (!img || !img.complete) {
        if (onSelesai) onSelesai(file);
        return;
      }

      const ukuran = hdAktif ? 512 : 400;
      const canvas = document.createElement("canvas");
      canvas.width = ukuran;
      canvas.height = ukuran;
      const ctx = canvas.getContext("2d");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.fillStyle = "#2B170A";
      ctx.fillRect(0, 0, ukuran, ukuran);

      const nw = img.naturalWidth || ukuran;
      const nh = img.naturalHeight || ukuran;
      const rasio = Math.max(ukuran / nw, ukuran / nh) * zoom;
      const w = nw * rasio;
      const h = nh * rasio;
      const skalaGeser = ukuran / 272;
      const dx = (ukuran - w) / 2 + geser.x * skalaGeser;
      const dy = (ukuran - h) / 2 + geser.y * skalaGeser;

      ctx.drawImage(img, dx, dy, w, h);

      if (hdAktif) {
        pertajamKanvas(ctx, ukuran, ukuran, 0.25);
      }

      const dataUrl = canvas.toDataURL("image/jpeg", 0.94);
      const byteString = atob(dataUrl.split(",")[1]);
      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const fileBaru = new File([ia], file.name || "batik-crop.jpg", {
        type: "image/jpeg",
      });

      if (onSelesai) onSelesai(fileBaru);
    } catch {
      if (onSelesai) onSelesai(file);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B170A]/75 p-4 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-[32px] p-6 text-[#432912] shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#AD7559] uppercase">
              Fokus Area Motif (1:1)
            </span>
            <h2 className="text-lg font-extrabold">Sesuaikan Potongan Kain</h2>
          </div>
          <button
            type="button"
            onClick={onBatal}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#432912]/10 text-xs font-bold hover:bg-[#432912] hover:text-white"
          >
            ✕
          </button>
        </div>

        <p className="mt-1 text-xs text-[#432912]/65">
          Geser dan perbesar pola kain agar motif utama memenuhi kotak fokus.
        </p>

        <div
          onMouseDown={mulaiGeser}
          onMouseMove={saatGeser}
          onMouseUp={hentiGeser}
          onMouseLeave={hentiGeser}
          onTouchStart={mulaiGeser}
          onTouchMove={saatGeser}
          onTouchEnd={hentiGeser}
          className="relative mx-auto mt-4 h-[272px] w-[272px] cursor-grab overflow-hidden rounded-[26px] border-2 border-[#AD7559] bg-[#2B170A] shadow-inner active:cursor-grabbing select-none"
        >
          <img
            ref={imgRef}
            src={imgUrl}
            alt="Pratinjau potong"
            draggable={false}
            style={{
              transform: `translate(${geser.x}px, ${geser.y}px) scale(${zoom})`,
              filter: hdAktif ? "contrast(1.04) saturate(1.05)" : "none",
            }}
            className="h-full w-full object-cover transition-transform duration-75"
          />
          <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 border border-white/25">
            <span className="border-r border-b border-white/20" />
            <span className="border-r border-b border-white/20" />
            <span className="border-b border-white/20" />
            <span className="border-r border-b border-white/20" />
            <span className="border-r border-b border-white/20" />
            <span className="border-b border-white/20" />
            <span className="border-r border-white/20" />
            <span className="border-r border-white/20" />
            <span />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-[11px] font-bold text-[#432912]/70">Zoom</span>
          <input
            type="range"
            min="1"
            max="2.6"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer accent-[#AD7559]"
          />
          <span className="w-10 text-right text-[11px] font-bold text-[#85522F]">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-[#C59C8A]/50 bg-white/75 px-3.5 py-2.5">
          <div>
            <p className="text-xs font-bold text-[#432912]">✦ Upscale &amp; Pertajam HD (512px)</p>
            <p className="text-[10px] text-[#432912]/60">
              Mengurangi blur hasil zoom &amp; mempertegas garis motif
            </p>
          </div>
          <button
            type="button"
            onClick={() => setHdAktif((v) => !v)}
            aria-pressed={hdAktif}
            className={`relative h-6 w-11 rounded-full transition ${
              hdAktif ? "bg-[#AD7559]" : "bg-[#432912]/20"
            }`}
          >
            <span
              className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                hdAktif ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={onBatal}
            className="flex-1 rounded-full border border-[#C59C8A] bg-white/80 py-2.5 text-xs font-bold text-[#432912] hover:bg-white"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={terapkanPotongan}
            className="flex-1 rounded-full bg-[#AD7559] py-2.5 text-xs font-bold text-white shadow-sm hover:brightness-105"
          >
            ✦ Potong &amp; Pindai
          </button>
        </div>
      </div>
    </div>
  );
}