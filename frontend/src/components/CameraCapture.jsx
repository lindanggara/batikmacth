import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fallbackInputRef = useRef(null);
  const [daftarKamera, setDaftarKamera] = useState([]);
  const [deviceIdAktif, setDeviceIdAktif] = useState("");
  const [facingMode, setFacingMode] = useState("environment");
  const [error, setError] = useState("");
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    let aktif = true;
    setSiap(false);
    setError("");

    async function hentikanStream() {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    }

    async function mulaiKamera() {
      await hentikanStream();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Browser memblokir akses kamera langsung. Gunakan tombol Unggah / Kamera Native di bawah.");
        return;
      }

      // Coba constraint berjenjang agar cocok di HP maupun Webcam Laptop Windows
      const kandidatConstraint = deviceIdAktif
        ? [{ video: { deviceId: { exact: deviceIdAktif } }, audio: false }, { video: true, audio: false }]
        : [
            { video: { facingMode: { ideal: facingMode } }, audio: false },
            { video: true, audio: false },
          ];

      let streamBerhasil = null;
      let errTerakhir = null;

      for (const constraint of kandidatConstraint) {
        try {
          streamBerhasil = await navigator.mediaDevices.getUserMedia(constraint);
          break;
        } catch (err) {
          errTerakhir = err;
        }
      }

      if (!aktif) {
        if (streamBerhasil) streamBerhasil.getTracks().forEach((t) => t.stop());
        return;
      }

      if (!streamBerhasil) {
        const namaErr = errTerakhir?.name || "";
        if (namaErr === "NotAllowedError" || namaErr === "PermissionDeniedError") {
          setError("Izin kamera ditolak browser. Klik ikon pengaturan/gembok di sebelah URL localhost:5173 lalu izinkan Kamera.");
        } else if (namaErr === "NotReadableError" || namaErr === "TrackStartError") {
          setError("Kamera sedang dipakai aplikasi lain (Zoom/Meet/Camera). Tutup aplikasi tersebut lalu coba lagi.");
        } else {
          setError("Perangkat kamera tidak terdeteksi. Kamu tetap bisa mengambil foto lewat tombol di bawah.");
        }
        return;
      }

      streamRef.current = streamBerhasil;

      // Muat daftar semua webcam/kamera yang tersedia setelah izin diberikan
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        if (aktif) setDaftarKamera(videoDevices);
      } catch {}

      if (videoRef.current) {
        videoRef.current.srcObject = streamBerhasil;
        try {
          await videoRef.current.play();
        } catch {}
        if (aktif) setSiap(true);
      }
    }

    mulaiKamera();
    return () => {
      aktif = false;
      hentikanStream();
    };
  }, [facingMode, deviceIdAktif]);

  function jepretFoto() {
    const video = videoRef.current;
    if (!video || !siap) return;

    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 640;
    const sisi = Math.min(vw, vh);
    const sx = (vw - sisi) / 2;
    const sy = (vh - sisi) / 2;

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, sx, sy, sisi, sisi, 0, 0, 640, 640);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const fileHasil = new File([blob], `batik-scan-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onCapture(fileHasil);
      },
      "image/jpeg",
      0.92
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#2B170A]/75 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-[30px] border border-white/80 bg-[#F3F1ED]/95 p-5 text-[#432912] shadow-[0_28px_70px_rgba(32,17,7,0.45)] backdrop-blur-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between gap-3 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#AD7559] uppercase">
              Pemindai Langsung
            </span>
            <h3 className="text-base font-extrabold text-[#432912]">Arahkan ke Kain Batik</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup kamera"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#432912]/10 text-xs font-bold text-[#432912] transition hover:bg-[#AD7559] hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Pilihan Perangkat Webcam jika terdeteksi lebih dari 1 */}
        {daftarKamera.length > 1 && !error && (
          <div className="mb-3">
            <select
              value={deviceIdAktif}
              onChange={(e) => setDeviceIdAktif(e.target.value)}
              className="w-full rounded-xl border border-[#C59C8A]/60 bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#432912] focus:outline-none"
            >
              <option value="">Kamera Otomatis</option>
              {daftarKamera.map((cam, idx) => (
                <option key={cam.deviceId} value={cam.deviceId}>
                  {cam.label || `Kamera ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Area Video / Error */}
        <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-[22px] border border-[#C59C8A]/50 bg-[#2B170A]">
          <input
            ref={fallbackInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onCapture(f);
            }}
          />

          {error ? (
            <div className="flex h-full flex-col items-center justify-center p-5 text-center text-white">
              <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#AD7559]/30 text-lg">
                📷
              </span>
              <p className="text-xs leading-relaxed text-[#F3F1ED]">{error}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fallbackInputRef.current?.click()}
                  className="rounded-full bg-[#AD7559] px-4 py-2 text-xs font-bold text-white shadow-sm"
                >
                  Buka Kamera Sistem / File
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="h-full w-full object-cover"
              />
              {/* Kotak Viewfinder 1:1 di Tengah */}
              <div className="pointer-events-none absolute inset-y-4 left-1/2 aspect-square -translate-x-1/2 rounded-2xl border-2 border-dashed border-white/85 shadow-[0_0_0_999px_rgba(32,17,7,0.35)]">
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/55 px-2.5 py-0.5 text-[9px] font-semibold text-white">
                  Area Pemindaian 1:1
                </span>
              </div>
            </>
          )}
        </div>

        {/* Tombol Aksi Bawah */}
        {!error && (
          <div className="mt-4 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setDeviceIdAktif("");
                setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
              }}
              className="rounded-full border border-[#C59C8A]/70 bg-white px-4 py-2.5 text-xs font-bold text-[#432912] transition hover:bg-[#F3F1ED]"
            >
              ↻ Balik
            </button>

            <button
              type="button"
              disabled={!siap}
              onClick={jepretFoto}
              className="flex-1 rounded-full bg-[#AD7559] py-2.5 text-xs font-bold text-white shadow-md transition hover:brightness-105 disabled:opacity-50"
            >
              {siap ? "● Ambil Foto & Identifikasi" : "Menghubungkan Kamera..."}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}