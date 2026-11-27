// 15 motif mengikuti kelas dataset (data/raw/TRAIN). id harus sama dengan id di backend (GET /motifs).
// Entri dengan draf: true isinya belum lengkap; cek dengan sumber referensi sebelum dipakai di laporan.
export const KATALOG = [
  {
    id: "bali",
    nama: "Batik Bali",
    daerah: "Bali",
    aliran: "Pesisir & Pulau Dewata",
    gambar: "/motif/bali.jpg",
    pola: "pola-megamendung",
    ciri: "Perpaduan ornamen khas Bali seperti burung bangau, kura-kura, rusa, dan singa bersayap dengan ukiran flora tropis yang dinamis.",
    sejarah: "Berkembang pesat sejak era 1970-an melalui akulturasi teknik batik tulis Jawa dengan estetika seni lukis Kamasan dan ukiran tradisional Bali.",
    anatomi: "Ornamen fauna mitologis berpadu sulur bunga kamboja dan daun paku dengan isen-isen cecek serta garis kontur tegas.",
    filosofi: "Melambangkan keharmonisan hubungan manusia dengan Tuhan, sesama, dan alam semesta (Tri Hita Karana).",
    pakem: "Motif sakral dengan simbol penjaga pura umumnya dikhususkan untuk upacara keagamaan dan odalan.",
    busana: "Kamen adat, udeng, kemeja semi-formal tropis, serta selendang upacara.",
  },
  {
    id: "betawi",
    nama: "Batik Betawi",
    daerah: "DKI Jakarta",
    aliran: "Pesisir",
    gambar: "/motif/betawi.jpg",
    pola: "pola-ceplok",
    ciri: "Menampilkan ikon budaya Jakarta seperti ondel-ondel, monas, penari cokek, dan pucuk rebung dengan warna cerah kontras.",
    sejarah: "Tumbuh di pesisir Batavia sejak abad ke-19 dengan pengaruh kuat budaya Tionghoa, Arab, Belanda, dan Sunda.",
    anatomi: "Bagian tumpal (pinggir kain) wajib dihiasi motif geometris Pucuk Rebung (segitiga runcing) berpadu warna merah, jingga, dan hijau terang.",
    filosofi: "Mencerminkan keterbukaan masyarakat Betawi yang ceria, egaliter, serta keteguhan menjaga tradisi di tengah modernitas.",
    pakem: "Posisi tumpal pucuk rebung pada sarung dikenakan di bagian depan sebagai simbol pertumbuhan dan harapan.",
    busana: "Sarung kebaya encim, baju sadariah modern, dan busana perayaan resmi daerah.",
  },
  {
    id: "celup",
    nama: "Batik Celup",
    daerah: "Nusantara (Palembang & Jawa)",
    aliran: "Teknik Ikat Celup",
    gambar: "/motif/celup.jpg",
    pola: "pola-kawung",
    ciri: "Pola gradasi organik menyerupai ledakan bintang, lingkaran konsentris, dan percikan warna hasil teknik ikat celup (jumputan).",
    sejarah: "Merupakan salah satu teknik pewarnaan rintang tertua di Nusantara yang dikenal sebagai Jumputan di Jawa dan Pelangi di Palembang.",
    anatomi: "Tidak menggunakan malam panas, melainkan ikatan benang kencang yang menciptakan pola simetris bergradasi lembut.",
    filosofi: "Melambangkan keberagaman warna kehidupan yang menyatu dalam satu harmoni utuh.",
    pakem: "Bersifat fleksibel tanpa pantangan keraton sehingga bebas dipadukan untuk berbagai kalangan.",
    busana: "Selendang, blus kasual modern, tunik, dan busana resor kontemporer.",
  },
  {
    id: "cendrawasih",
    nama: "Batik Cendrawasih",
    daerah: "Papua",
    aliran: "Nusantara Timur",
    gambar: "/motif/cendrawasih.jpg",
    pola: "pola-megamendung",
    ciri: "Menonjolkan siluet burung Cendrawasih dengan ekor panjang menjuntai, dipadukan ukiran tifa dan motif geometris Asmat.",
    sejarah: "Mulai dikembangkan pada pertengahan abad ke-20 dengan mengangkat kekayaan fauna endemik dan seni ukir khas tanah Papua.",
    anatomi: "Fokus utama pada lengkungan bulu ekor burung Cendrawasih yang halus berlatar warna tanah merah, cokelat sogan, atau biru laut.",
    filosofi: "Simbol keindahan, keanggunan, kemuliaan, dan kebanggaan identitas alam Papua sebagai burung surga.",
    pakem: "Dikenakan dengan penuh penghormatan dalam penyambutan tamu kehormatan dan perayaan budaya.",
    busana: "Kemeja resmi eksekutif, gaun malam etnik, dan busana upacara daerah.",
  },
  {
    id: "dayak",
    nama: "Batik Dayak",
    daerah: "Kalimantan (Tengah, Timur & Barat)",
    aliran: "Pedalaman Borneo",
    gambar: "/motif/dayak.jpg",
    pola: "pola-megamendung",
    ciri: "Menampilkan ukiran sulur pakis (kelakai), tameng perang (talawang), burung enggang, dan mandau dengan kontras warna tanah serta merah-kuning khas Borneo.",
    sejarah: "Lahir dari adaptasi seni ukir kayu dan tato tradisional suku Dayak ke atas media kain sebagai simbol identitas dan pelestarian budaya Kalimantan.",
    anatomi: "Garis lengkung spiral (pilin berganda) yang saling bertaut membentuk siluet burung enggang dan perisai dengan isian titik serta garis tegas.",
    filosofi: "Melambangkan keberanian, perlindungan leluhur, kesetiaan, dan keterikatan spiritual manusia dengan hutan alam Kalimantan.",
    pakem: "Ornamen burung enggang dan tameng secara adat dimaknai sebagai simbol kepemimpinan dan kehormatan dalam upacara Gawai Dayak.",
    busana: "Kemeja resmi daerah, rompi adat, selendang upacara, dan busana kontemporer etnik."
  },
  {
    id: "geblek-renteng",
    nama: "Batik Geblek Renteng",
    daerah: "Kulon Progo, DI Yogyakarta",
    aliran: "Klasik Kontemporer",
    gambar: "/motif/geblek-renteng.jpg",
    pola: "pola-ceplok",
    ciri: "Pola beruntai menyerupai angka delapan (makanan khas geblek) yang berderet simetris berpadu simbol Binangun dan buah manggis.",
    sejarah: "Diciptakan melalui sayembara desain batik khas Kabupaten Kulon Progo pada 2012 untuk mengangkat ikon kuliner lokal dan semangat pembangunan daerah.",
    anatomi: "Bentuk dua bulatan menyatu (angka 8) yang dirangkai secara diagonal atau horizontal dengan isen-isen kembang dan dedaunan.",
    filosofi: "Melambangkan persatuan masyarakat yang saling bergandengan tangan (renteng), kemakmuran, serta kebanggaan terhadap kearifan lokal.",
    pakem: "Digunakan sebagai identitas resmi seragam daerah Kulon Progo dan terbuka dipakai oleh seluruh lapisan masyarakat.",
    busana: "Seragam kerja, kemeja formal, kebaya modern, dan kain bawahan acara resmi."
  },
  {
    id: "insang",
    nama: "Batik Insang (Corak Insang)",
    daerah: "Pontianak, Kalimantan Barat",
    aliran: "Pesisir Melayu",
    gambar: "/motif/insang.jpg",
    pola: "pola-parang",
    ciri: "Susunan garis bergelombang dan lengkungan berulang menyerupai struktur insang ikan dengan warna cerah seperti kuning emas, merah, dan hijau.",
    sejarah: "Merupakan tenun dan batik tradisional masyarakat Melayu Pontianak yang tumbuh di tepian Sungai Kapuas sebagai pusat perniagaan maritim.",
    anatomi: "Deretan lengkung berlapis yang tersusun rapat dan berirama mengikuti alur air sungai dengan isen-isen garis halus.",
    filosofi: "Menggambarkan napas kehidupan, ketekunan mencari rezeki, dan kemampuan beradaptasi seperti ikan yang hidup selaras dengan arus sungai.",
    pakem: "Sering dikenakan pada upacara adat Melayu Pontianak, pernikahan, dan penyambutan tamu kehormatan.",
    busana: "Baju kurung Melayu, teluk belanga, kain samping, dan selendang pesta."
  },
  {
    id: "kawung",
    nama: "Batik Kawung",
    daerah: "Yogyakarta",
    aliran: "Pedalaman Keraton",
    gambar: "/motif/kawung.jpg",
    pola: "pola-kawung",
    ciri: "Empat bulatan lonjong menyerupai irisan buah aren (kolang-kaling) yang tersusun simetris mengelilingi titik pusat.",
    sejarah: "Diciptakan pada masa Kesultanan Mataram abad ke-13 dan dahulu merupakan salah satu motif larangan khusus keluarga kerajaan.",
    anatomi: "Empat kelopak elips simetris dengan dua titik kecil (cecek) di setiap ujung kelopak dan belah ketupat kecil di tengahnya.",
    filosofi: "Melambangkan kesucian hati, pengendalian hawa nafsu, keadilan, serta harapan agar pemakainya berguna bagi sesama.",
    pakem: "Dahulu hanya boleh dikenakan oleh raja dan kerabat dekat di lingkungan Keraton Yogyakarta.",
    busana: "Kain sinjang kebaya kutubaru, beskap, kemeja formal, dan busana wisuda.",
  },
  {
    id: "lasem",
    nama: "Batik Lasem",
    daerah: "Rembang, Jawa Tengah",
    aliran: "Pesisir",
    gambar: "/motif/lasem.jpg",
    pola: "pola-megamendung",
    ciri: "Dominasi warna merah darah ayam (abang getih pithik) yang menyala dipadukan ornamen naga, burung hong, dan bunga seruni.",
    sejarah: "Lahir dari akulturasi budaya Tionghoa-Jawa sejak pendaratan armada Laksamana Cheng Ho di pesisir Lasem pada abad ke-15.",
    anatomi: "Garis canting sangat halus dan rapat dengan latar belakang penuh isen-isen latohan (tumbuhan laut) dan kricak.",
    filosofi: "Simbol keberanian, kemakmuran, panjang umur, dan persaudaraan lintas budaya yang harmonis.",
    pakem: "Kain merah Lasem sering menjadi bagian penting dalam seserahan pernikahan adat peranakan.",
    busana: "Kebaya encim, kemeja pesta, selendang, dan busana perayaan Imlek maupun pernikahan.",
  },
  {
    id: "megamendung",
    nama: "Batik Megamendung",
    daerah: "Cirebon, Jawa Barat",
    aliran: "Pesisir",
    gambar: "/motif/megamendung.jpg",
    pola: "pola-megamendung",
    ciri: "Gumpalan awan bergelung berlapis-lapis dengan gradasi tujuh tingkatan warna, umumnya biru langit hingga biru tua.",
    sejarah: "Muncul di Keraton Kasepuhan Cirebon pada abad ke-16 sebagai perpaduan estetika seni keramik Tiongkok dan nilai tasawuf.",
    anatomi: "Garis lengkung awan berujung lancip tanpa isen-isen titik di dalamnya, mengandalkan gradasi warna yang halus.",
    filosofi: "Melambangkan kesabaran, keteduhan jiwa, dan kemampuan menahan amarah layaknya awan mendung yang menyejukkan bumi.",
    pakem: "Tujuh gradasi warna melambangkan tujuh lapisan langit dan tahapan perjalanan spiritual manusia.",
    busana: "Kemeja kerja kreatif, blazer etnik, syal, dan busana semi-formal modern.",
  },
  {
    id: "pala",
    nama: "Batik Pala",
    daerah: "Maluku & Banda Neira",
    aliran: "Nusantara Timur",
    gambar: "/motif/pala.jpg",
    pola: "pola-ceplok",
    ciri: "Menampilkan ilustrasi buah pala yang merekah memperlihatkan biji dan fuli merah berpadu cengkeh serta ombak laut Banda.",
    sejarah: "Terinspirasi dari kejayaan Kepulauan Banda sebagai pusat perdagangan rempah dunia yang menjadi sejarah penting maritim Nusantara.",
    anatomi: "Ornamen buah pala bulat terbelah dengan aksen fuli menjalar dan sulur daun rempah di atas latar berwarna hangat.",
    filosofi: "Melambangkan kemakmuran, kekayaan alam Nusantara, serta semangat keterbukaan dan keramahan masyarakat kepulauan.",
    pakem: "Merupakan motif kreasi daerah Maluku yang bebas dikenakan pada acara formal maupun kasual tanpa pantangan adat.",
    busana: "Kemeja batik modern, blus formal, syal, dan busana duta budaya."
  },
  {
    id: "parang",
    nama: "Batik Parang",
    daerah: "Jawa Tengah (Solo & Yogya)",
    aliran: "Pedalaman Keraton",
    gambar: "/motif/parang.jpg",
    pola: "pola-parang",
    ciri: "Susunan garis miring 45 derajat menyerupai huruf 'S' yang saling berkait berkesinambungan tanpa terputus.",
    sejarah: "Diciptakan oleh Panembahan Senopati setelah bertapa di Pantai Selatan sambil mengamati ombak yang menghantam karang.",
    anatomi: "Terdiri dari bilah utama (lidah api/ombak), mlinjon (belah ketupat pemisah), dan mata gareng di sela-sela lengkungan.",
    filosofi: "Melambangkan semangat pantang menyerah, keteguhan hati, dan kesinambungan perjuangan dari generasi ke generasi.",
    pakem: "Menurut pakem adat Jawa, motif Parang tidak disarankan dipakai saat upacara pernikahan karena dikhawatirkan memicu perselisihan.",
    busana: "Upacara kenegaraan, acara adat resmi, kemeja formal, dan busana kerja berwibawa.",
  },
  {
    id: "poleng",
    nama: "Batik Poleng",
    daerah: "Bali",
    aliran: "Sakral Pulau Dewata",
    gambar: "/motif/poleng.jpg",
    pola: "pola-ceplok",
    ciri: "Pola kotak-kotak papan catur kontras hitam dan putih (atau kombinasi abu-abu pada Poleng Sudhamala) yang tegas dan geometris.",
    sejarah: "Berakar dari tradisi wastra sakral Bali (Saput Poleng) yang telah digunakan selama berabad-abad untuk membungkus arca, pohon keramat, dan pelinggih pura.",
    anatomi: "Kisi persegi sama sisi bergantian antara warna hitam pekat dan putih bersih yang dapat diperkaya isen-isen batik pada tepiannya.",
    filosofi: "Mewujudkan konsep Rwa Bhineda, yaitu keseimbangan abadi antara dua kekuatan berlawanan di alam semesta (baik-buruk, terang-gelap).",
    pakem: "Dalam tradisi Bali, kain poleng dihormati sebagai busana penjaga kesucian pura (pecalang) sehingga pemakaiannya menjaga kesopanan.",
    busana: "Kamen/saput adat Bali, busana pecalang, serta aksen busana etnik modern."
  },
  {
    id: "sekar-jagad",
    nama: "Batik Sekar Jagad",
    daerah: "Yogyakarta & Solo",
    aliran: "Pedalaman Keraton",
    gambar: "/motif/sekar-jagad.jpg",
    pola: "pola-ceplok",
    ciri: "Kumpulan pulau-pulau geometris tidak beraturan yang masing-masing diisi motif berbeda seperti kawung, parang, dan flora.",
    sejarah: "Berasal dari kata 'Kar' (peta dalam bahasa Belanda) dan 'Jagad' (dunia), yang bermakna keindahan peta keberagaman dunia.",
    anatomi: "Bidang-bidang melengkung mirip peta kepulauan yang dibatasi garis tegas dengan isen-isen berbeda di tiap petaknya.",
    filosofi: "Melambangkan keindahan, pesona budi pekerti, serta keharmonisan dalam keberagaman.",
    pakem: "Sering dikenakan dalam upacara lamaran atau pernikahan sebagai harapan agar pemakainya memancarkan pesona kebaikan.",
    busana: "Busana pengantin adat, kebaya resmi, kain panjang pesta, dan kemeja eksklusif.",
  },
  {
    id: "tambal",
    nama: "Batik Tambal",
    daerah: "Yogyakarta",
    aliran: "Pedalaman Keraton",
    gambar: "/motif/tambal.jpg",
    pola: "pola-parang",
    ciri: "Susunan bidang segitiga atau belah ketupat menyerupai kain perca yang dijahit menyatu, masing-masing berisi motif klasik berbeda.",
    sejarah: "Muncul di Yogyakarta pada masa lampau dan dipercaya memiliki nilai spiritual sebagai penolak bala serta penyembuh.",
    anatomi: "Gabungan puluhan petak geometris segitiga yang memuat potongan motif parang, kawung, ceplok, dan nitik secara berdampingan.",
    filosofi: "Bermakna 'menambal' atau memperbaiki kekurangan diri, memulihkan semangat hidup, serta menyatukan perbedaan menjadi kekuatan.",
    pakem: "Dalam tradisi lama, kain Batik Tambal sering diselimutkan kepada orang sakit sebagai doa kesembuhan.",
    busana: "Kemeja statement modern, outer etnik, selendang, dan busana seni.",
  },
];

export function unduhDatasetCSV(daftar = KATALOG) {
  const header = ["id", "nama", "daerah", "aliran", "ciri_visual", "filosofi", "pakem_adat"];
  const baris = daftar.map((m) =>
    [m.id, m.nama, m.daerah, m.aliran, m.ciri, m.filosofi, m.pakem]
      .map((val) => `"${String(val || "").replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = "\uFEFF" + [header.join(","), ...baris].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `batikmatch-dataset-${daftar.length}-motif.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function unduhDatasetJSON(daftar = KATALOG) {
  const payload = {
    dataset: "Indonesian Batik Motifs (15 Classes - Corak App Reference)",
    source: "https://www.kaggle.com/datasets/alfanme/indonesian-batik-motifs-corak-app",
    total_classes: daftar.length,
    exported_at: new Date().toISOString(),
    classes: daftar,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `batikmatch-dataset-${daftar.length}-motif.json`;
  a.click();
  URL.revokeObjectURL(url);
}