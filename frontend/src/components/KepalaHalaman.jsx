export default function KepalaHalaman({ judul, sub, children }) {
  return (
    <header className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-nila-mid via-nila to-nila-deep px-7 pb-14 pt-10 text-kain lg:rounded-[32px] lg:px-14 lg:pb-16 lg:pt-14">
      <div className="pola-halus absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="pola-kawung absolute -right-10 -top-10 hidden h-56 w-56 rotate-12 rounded-[40px] opacity-70 ring-2 ring-malam lg:block" aria-hidden="true" />
      <div className="relative">
        <h1 className="font-display text-5xl font-semibold leading-none lg:text-6xl">{judul}</h1>
        {sub && <p className="mt-3 max-w-xl text-kain/80 lg:text-lg">{sub}</p>}
        {children}
      </div>
      <div className="pita-tumpal absolute inset-x-0 bottom-0" aria-hidden="true" />
    </header>
  );
}