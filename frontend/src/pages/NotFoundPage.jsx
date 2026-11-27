import { Link } from "react-router-dom";
import { BatikMatchMascot } from "../components/BatikMatchLogo";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-5">
      <div className="glass-panel max-w-md rounded-[32px] p-8 text-center">
        <div className="mx-auto w-fit rounded-3xl bg-[#432912]/10 p-3">
          <BatikMatchMascot size={76} />
        </div>
        <span className="mt-4 inline-block rounded-full bg-[#AD7559]/15 px-3 py-1 text-[10px] font-bold tracking-widest text-[#85522F] uppercase">
          Halaman Tidak Ditemukan (404)
        </span>
        <h1 className="mt-2 text-2xl font-bold text-[#432912]">Motif Tersebut Belum Terdaftar</h1>
        <p className="mt-2 text-xs leading-relaxed text-[#432912]/70">
          Alamat halaman yang kamu buka tidak tersedia atau telah dipindahkan ke studio baru BatikMatch.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <Link
            to="/studio"
            className="rounded-full border border-[#C59C8A]/70 bg-white/80 px-6 py-2.5 text-xs font-bold text-[#432912]"
          >
            Buka Studio Pindai
          </Link>
        </div>
      </div>
    </div>
  );
}