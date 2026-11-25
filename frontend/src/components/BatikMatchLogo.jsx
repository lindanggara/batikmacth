export function BatikMatchMascot({ size = 42, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Latar Belakang Kaca Hangat */}
      <rect width="64" height="64" rx="18" fill="url(#bgGrad)" />

      {/* Sudut Lensa Viewfinder AI [ ] */}
      <path d="M12 20V14C12 12.8954 12.8954 12 14 12H20" stroke="#C59C8A" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M44 12H50C51.1046 12 52 12.8954 52 14V20" stroke="#C59C8A" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M52 44V50C52 51.1046 51.1046 52 50 52H44" stroke="#C59C8A" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M20 52H14C12.8954 52 12 51.1046 12 50V44" stroke="#C59C8A" strokeWidth="2.6" strokeLinecap="round" />

      {/* Jambul Merak / Tetes Malam Canting */}
      <circle cx="32" cy="14" r="2.5" fill="#C59C8A" />
      <path d="M32 16.5V21" stroke="#C59C8A" strokeWidth="2.2" strokeLinecap="round" />

      {/* Sayap Kiri & Kanan Bermotif Kawung */}
      <ellipse cx="20" cy="36" rx="7" ry="10" transform="rotate(-18 20 36)" fill="#AD7559" />
      <ellipse cx="44" cy="36" rx="7" ry="10" transform="rotate(18 44 36)" fill="#AD7559" />
      <circle cx="19" cy="35" r="2" fill="#F3F1ED" opacity="0.7" />
      <circle cx="45" cy="35" r="2" fill="#F3F1ED" opacity="0.7" />

      {/* Badan Maskot Bulat Menggemaskan */}
      <rect x="21" y="21" width="22" height="26" rx="11" fill="#F3F1ED" />

      {/* Hiasan Kawung Mini di Dahi */}
      <circle cx="32" cy="25.5" r="1.4" fill="#AD7559" />
      <circle cx="29.5" cy="26.5" r="1" fill="#C59C8A" />
      <circle cx="34.5" cy="26.5" r="1" fill="#C59C8A" />

      {/* Mata Bulat Lucu & Pipi Merona */}
      <circle cx="27.5" cy="33.5" r="2.6" fill="#432912" />
      <circle cx="36.5" cy="33.5" r="2.6" fill="#432912" />
      <circle cx="28.3" cy="32.7" r="0.9" fill="#FFFFFF" />
      <circle cx="37.3" cy="32.7" r="0.9" fill="#FFFFFF" />

      <ellipse cx="24.5" cy="37" rx="2.1" ry="1.2" fill="#C59C8A" opacity="0.75" />
      <ellipse cx="39.5" cy="37" rx="2.1" ry="1.2" fill="#C59C8A" opacity="0.75" />

      {/* Paruh Kecil Tersenyum */}
      <path d="M30 36.5L32 39.2L34 36.5H30Z" fill="#AD7559" />

      {/* Aksen Kilau Bintang */}
      <path d="M47 17L48 19.5L50.5 20.5L48 21.5L47 24L46 21.5L43.5 20.5L46 19.5L47 17Z" fill="#F3F1ED" />

      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#85522F" />
          <stop offset="1" stopColor="#432912" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function BatikMatchLogo({ size = 40, showTagline = true }) {
  return (
    <div className="inline-flex items-center gap-3 select-none">
      <BatikMatchMascot size={size} className="shrink-0 shadow-sm transition-transform duration-300 hover:scale-105" />
      <div>
        <div className="flex items-center gap-1 text-lg font-extrabold tracking-tight leading-none">
          <span className="text-[#432912]">Batik</span>
          <span className="text-[#AD7559]">Match</span>
          <span className="text-xs text-[#AD7559]">✦</span>
        </div>
        {showTagline && (
          <span className="mt-1 block text-[10px] font-semibold tracking-wider text-[#85522F] uppercase">
            Wastra AI Studio
          </span>
        )}
      </div>
    </div>
  );
}