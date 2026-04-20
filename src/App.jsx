import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Icons (inline SVG helpers) ──────────────────────────────────────────────
const Icon = ({ d, size = 22, stroke = "currentColor", fill = "none", strokeWidth = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const Icons = {
  search:   "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  bag:      ["M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z", "M3 6h18", "M16 10a4 4 0 0 1-8 0"],
  user:     ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  menu:     ["M3 12h18", "M3 6h18", "M3 18h18"],
  x:        ["M18 6L6 18", "M6 6l12 12"],
  heart:    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  star:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  arrow_l:  "M19 12H5M12 19l-7-7 7-7",
  arrow_r:  "M5 12h14M12 5l7 7-7 7",
  check:    "M20 6L9 17l-5-5",
  whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z",
  phone:    ["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.62 4.9a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"],
  chevron_d:"M6 9l6 6 6-6",
  chevron_r:"M9 18l6-6-6-6",
  filter:   ["M22 3H2l8 9.46V19l4 2v-8.54L22 3z"],
  grid:     ["M3 3h7v7H3z","M14 3h7v7h-7z","M14 14h7v7h-7z","M3 14h7v7H3z"],
  list:     ["M8 6h13","M8 12h13","M8 18h13","M3 6h.01","M3 12h.01","M3 18h.01"],
  trash:    ["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"],
  plus:     ["M12 5v14","M5 12h14"],
  minus:    "M5 12h14",
  eye:      ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  sparkle:  ["M12 2l2.5 5 5.5.5-4 4 1 5.5L12 14.5 7 17l1-5.5-4-4 5.5-.5z"],
};

// ─── Product Data (all 14) ───────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1, name: "أدفنتشر إكستريم", brand: "أرمادا",
    inspiredBy: "Boss The Scent Elixir", inspiredByAr: "بوس ذا سينت إكسير",
    notes: "الفلفل الأحمر، الخزامى، خشب الصندل",
    notesList: ["الفلفل الأحمر", "الخزامى", "خشب الصندل"],
    price: 289, oldPrice: 380,
    tag: "الأكثر مبيعاً", tagColor: "#C9A84C",
    category: "men", concentration: "Eau de Parfum", size: "100ml",
    description: "عطر جريء يجمع بين حرارة الفلفل الأحمر وأناقة الخزامى وعمق خشب الصندل. استلهام دقيق من إكسير بوس.",
    image: "/product-images/p1.png",
  },
  {
    id: 2, name: "كاريزما إكستريم", brand: "أرمادا",
    inspiredBy: "Black XS L'Exces", inspiredByAr: "بلاك إكس أس لكزس",
    notes: "العنبر، الباتشولي، الخزامى",
    notesList: ["العنبر", "الباتشولي", "الخزامى"],
    price: 295, oldPrice: 390,
    tag: "حصري", tagColor: "#1a1a1a",
    category: "men", concentration: "Eau de Parfum", size: "100ml",
    description: "كاريزما بلا حدود. مزيج من العنبر الدافئ والباتشولي العميق يمنحك حضوراً لا يُنسى.",
    image: "/product-images/p2.png",
  },
  {
    id: 3, name: "أكوا دي موناكو", brand: "أرمادا",
    inspiredBy: "Chanel Chance Eau Tendre", inspiredByAr: "شانيل شانس أو تندر",
    notes: "المسك، العنبر، الياسمين",
    notesList: ["المسك", "العنبر", "الياسمين"],
    price: 310, oldPrice: 420,
    tag: "جديد", tagColor: "#2E7D32",
    category: "women", concentration: "Eau de Parfum", size: "100ml",
    description: "أنوثة راقية مستوحاة من المدن الساحلية. المسك الناعم يلتقي بالياسمين في تناغم لا مثيل له.",
    image: "/product-images/p3.png",
  },
  {
    id: 4, name: "بلومنج ليدي", brand: "أرمادا",
    inspiredBy: "Good Girl Blush", inspiredByAr: "كارولينا هيريرا قود غيرل بلاش",
    notes: "البرغموت، اللوز المر، الفاونيا، الفانيليا",
    notesList: ["البرغموت", "اللوز المر", "الفاونيا", "الفانيليا"],
    price: 275, oldPrice: 360,
    tag: "نسائي", tagColor: "#C62828",
    category: "women", concentration: "Eau de Parfum", size: "100ml",
    description: "أنثى زاهرة في كل موقف. البرغموت المنعش يعانق الفاونيا الحريرية في تجربة عطرية مميزة.",
    image: "/product-images/p4.jpg",
  },
  {
    id: 5, name: "ماتيير غون ليدي", brand: "أرمادا",
    inspiredBy: "Valaya - Parfums de Marly", inspiredByAr: "فالايا - بارفومز دو مارلي",
    notes: "الألدهيدات، الخوخ الأبيض، زهر البرتقال، المسك",
    notesList: ["الألدهيدات", "الخوخ الأبيض", "زهر البرتقال", "المسك"],
    price: 340, oldPrice: 450,
    tag: "فاخر", tagColor: "#6A1B9A",
    category: "women", concentration: "Eau de Parfum", size: "75ml",
    description: "رقي باريسي خالص. الخوخ الأبيض يتشابك مع زهر البرتقال ليخلق لوحة عطرية من الرفاهية.",
    image: "/product-images/p5.jpg",
  },
  {
    id: 6, name: "يو ماجستيك", brand: "أرمادا",
    inspiredBy: "Vanilla Powder", inspiredByAr: "ماتيري بريمير فانيلا باودر",
    notes: "جوز الهند، الفانيليا، المسك الأبيض",
    notesList: ["جوز الهند", "الفانيليا", "المسك الأبيض"],
    price: 310, oldPrice: 400,
    tag: "حصري", tagColor: "#1a1a1a",
    category: "unisex", concentration: "Eau de Parfum", size: "100ml",
    description: "دفء الفانيليا الراقية في مزيج ساحر مع جوز الهند والمسك الأبيض. ملكية تحملها معك.",
    image: "/product-images/p6.jpg",
  },
  {
    id: 7, name: "جيرجيوس", brand: "أرمادا",
    inspiredBy: "Million Gold 1", inspiredByAr: "باكو رابان مليون جولد",
    notes: "الكمثري، الورد، الخزامى، الفانيليا",
    notesList: ["الكمثري", "الورد", "الخزامى", "الفانيليا"],
    price: 285, oldPrice: 375,
    tag: "الأكثر مبيعاً", tagColor: "#C9A84C",
    category: "women", concentration: "Eau de Parfum", size: "100ml",
    description: "جمال يتألق. الكمثري الطازج يرقص مع ورد الطيف في سيمفونية عطرية تأسر الأحاسيس.",
    image: "/product-images/p7.jpg",
  },
  {
    id: 8, name: "كوين بيوتي", brand: "أرمادا",
    inspiredBy: "La Bomba", inspiredByAr: "كارولينا هيريرا لا بومبا",
    notes: "فاكهة التنين، الفاونيا الحمراء، الفانيليا",
    notesList: ["فاكهة التنين", "الفاونيا الحمراء", "الفانيليا"],
    price: 285, oldPrice: 370,
    tag: "جديد", tagColor: "#2E7D32",
    category: "women", concentration: "Eau de Parfum", size: "100ml",
    description: "انفجار من الجرأة والأنوثة. فاكهة التنين الاستوائية تلتقي بالفاونيا الحمراء في لحظة ملكية.",
    image: "/product-images/p8.jpg",
  },
  {
    id: 9, name: "ماجيك أورينتال", brand: "أرمادا",
    inspiredBy: "Maison Crivelli - Oud Maracuja", inspiredByAr: "ميزون كريفلي - عود ماراكوجا",
    notes: "الباشون فروت، الزعفران، العود، الجلود",
    notesList: ["الباشون فروت", "الزعفران", "العود", "الجلود"],
    price: 345, oldPrice: 460,
    tag: "فخامة العود", tagColor: "#4E342E",
    category: "oriental", concentration: "Extrait de Parfum", size: "100ml",
    description: "سحر الشرق في زجاجة. العود الغني والزعفران الملكي يخلقان تجربة عطرية استثنائية لا تُنسى.",
    image: "/product-images/p9.jpg",
  },
  {
    id: 10, name: "أكتور لاكجري", brand: "أرمادا",
    inspiredBy: "Lancôme - Midnight Rose", inspiredByAr: "لانكوم - ميدنايت روز",
    notes: "توت العليق، الورد، القرفة الصينية، الفانيليا",
    notesList: ["توت العليق", "الورد", "القرفة الصينية", "الفانيليا"],
    price: 295, oldPrice: 390,
    tag: "", tagColor: "",
    category: "women", concentration: "Eau de Parfum", size: "80ml",
    description: "غموض الليل في وردة واحدة. توت العليق الحيوي يلتقي بالقرفة الدافئة في خليط لا يقاوم.",
    image: "/product-images/p10.jpg",
  },
  {
    id: 11, name: "لويس نايس", brand: "أرمادا",
    inspiredBy: "Gucci - Guilty Elixir", inspiredByAr: "قوتشي - قيلتي إليكسير",
    notes: "زهر البرتقال، جوزة الطيب، السوسن، الباتشولي",
    notesList: ["زهر البرتقال", "جوزة الطيب", "السوسن", "الباتشولي"],
    price: 320, oldPrice: 420,
    tag: "حصري", tagColor: "#1a1a1a",
    category: "men", concentration: "Elixir de Parfum", size: "75ml",
    description: "ذكورة متطورة وجريئة. زهر البرتقال المنعش يواجه الباتشولي العميق في مزيج لا يقاوم.",
    image: "/product-images/p11.jpg",
  },
  {
    id: 12, name: "لومينوس", brand: "أرمادا",
    inspiredBy: "Kayali 18", inspiredByAr: "كايالي 18",
    notes: "الفريزيا، الليمون الإيطالي، المارشميلو، الفانيليا",
    notesList: ["الفريزيا", "الليمون الإيطالي", "المارشميلو", "الفانيليا"],
    price: 265, oldPrice: 345,
    tag: "الأكثر مبيعاً", tagColor: "#C9A84C",
    category: "women", concentration: "Eau de Parfum", size: "100ml",
    description: "ضوء ونعومة في كل رشة. الفريزيا الزاهية تتحد مع حلاوة المارشميلو في عطر يشعل البهجة.",
    image: "/product-images/p12.jpg",
  },
  {
    id: 13, name: "إكسيلينسي", brand: "أرمادا",
    inspiredBy: "Accento Xerjo", inspiredByAr: "أكسينتو زيرجو",
    notes: "الأناناس، الصنوبر، الفلفل الوردي",
    notesList: ["الأناناس", "الصنوبر", "الفلفل الوردي"],
    price: 280, oldPrice: 360,
    tag: "جديد", tagColor: "#2E7D32",
    category: "unisex", concentration: "Eau de Parfum", size: "100ml",
    description: "انتعاش لا يتوقف. الأناناس الاستوائي مع الفلفل الوردي يخلقان إيقاعاً عطرياً لا مثيل له.",
    image: "/product-images/p13.jpg",
  },
  {
    id: 14, name: "بويس إمبريال", brand: "أرمادا",
    inspiredBy: "Bois Impérial", inspiredByAr: "بويس إمبيريال إيسنشيال بارفومز",
    notes: "خشب الأكيجاال، الباتشولي، نجيل الهند",
    notesList: ["خشب الأكيجاال", "الباتشولي", "نجيل الهند"],
    price: 330, oldPrice: 440,
    tag: "فاخر", tagColor: "#6A1B9A",
    category: "unisex", concentration: "Eau de Parfum", size: "75ml",
    description: "امبراطورية من الخشب الفاخر. خشب الأكيجاال الاستوائي يتناغم مع نجيل الهند في روعة خالدة.",
    image: "/product-images/p14.jpg",
  },
];

const CATEGORIES = [
  { id: "all",     label: "الكل" },
  { id: "men",     label: "رجالي" },
  { id: "women",   label: "نسائي" },
  { id: "unisex",  label: "للجنسين" },
  { id: "oriental",label: "شرقي" },
];

const WA_NUM = "966555098359";
const waLink = (msg = "") => `https://wa.me/${WA_NUM}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;

// ─── Sub-components ──────────────────────────────────────────────────────────

function AnnouncementBar() {
  const waUrl = waLink();
  return (
    <div style={{ background: "#0A0A0A", color: "#fff", textAlign: "center", padding: "10px 16px", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
      <span style={{ color: "#C9A84C" }}>✦ البديل الذكي لعطرك المفضل ✦</span>
      <span style={{ margin: "0 12px", opacity: 0.3 }}>|</span>
      <span>للطلب: </span>
      <a href={waUrl} dir="ltr" style={{ color: "#25D366", textDecoration: "none", fontWeight: 800 }}>
        +966 55 509 8359
      </a>
      <span style={{ margin: "0 12px", opacity: 0.3 }}>|</span>
      <span style={{ color: "#C9A84C" }}>شحن سريع لجميع مناطق المملكة</span>
    </div>
  );
}

function Header({ cartCount, onCartOpen, searchQuery, setSearchQuery, mobileMenuOpen, setMobileMenuOpen, activeCategory, setActiveCategory }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hStyle = {
    position: "sticky", top: 0, zIndex: 100,
    background: scrolled ? "rgba(255,255,255,0.97)" : "#fff",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #EFEFEF",
    boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
    transition: "all 0.3s",
  };

  return (
    <header style={hStyle}>
      {/* Main row */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 72, gap: 16 }}>
        {/* Mobile menu btn */}
        <button onClick={() => setMobileMenuOpen(true)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: "50%" }} className="mobile-menu-btn">
          <Icon d={Icons.menu} />
        </button>

        {/* Logo */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", textDecoration: "none" }}>
          <div style={{ width: 44, height: 44, border: "2px solid #0A0A0A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, letterSpacing: 1 }}>AR</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 18, letterSpacing: 2, textTransform: "uppercase", lineHeight: 1 }}>Armada</span>
        </div>

        {/* Search bar - desktop */}
        <div style={{ flex: 1, maxWidth: 520, margin: "0 32px", position: "relative" }} className="desktop-search">
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ابحث عن عطر أو نوتة عطرية..."
            style={{
              width: "100%", background: "#F7F7F7", border: "1.5px solid #EFEFEF",
              borderRadius: 50, padding: "12px 48px 12px 20px",
              fontSize: 13, fontFamily: "'Tajawal', sans-serif", outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "#C9A84C"}
            onBlur={e => e.target.style.borderColor = "#EFEFEF"}
          />
          <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#999" }}>
            <Icon d={Icons.search} size={18} />
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginRight: "auto" }}>
          {/* Mobile search */}
          <button onClick={() => setSearchOpen(!searchOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 10, borderRadius: "50%", color: "#333" }} className="mobile-search-btn">
            <Icon d={Icons.search} size={22} />
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 10, borderRadius: "50%", color: "#333" }}>
            <Icon d={Icons.user} size={22} />
          </button>
          <button onClick={onCartOpen} style={{ background: "none", border: "none", cursor: "pointer", padding: 10, borderRadius: "50%", position: "relative", color: "#333" }}>
            <Icon d={Icons.bag} size={22} />
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: 4, right: 4,
                background: "#C9A84C", color: "#000", fontSize: 10, fontWeight: 900,
                width: 18, height: 18, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "pulse-gold 2s infinite",
              }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div style={{ padding: "8px 16px 12px", borderTop: "1px solid #EFEFEF" }} className="mobile-search-bar">
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ابحث..."
            autoFocus
            style={{ width: "100%", background: "#F7F7F7", border: "1px solid #ddd", borderRadius: 50, padding: "10px 20px", fontSize: 14, fontFamily: "'Tajawal', sans-serif", outline: "none" }}
          />
        </div>
      )}

      {/* Nav */}
      <nav style={{ borderTop: "1px solid #F0F0F0", background: "#fff" }} className="desktop-nav">
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "center", gap: 4 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "14px 20px", fontSize: 13, fontWeight: 700,
                fontFamily: "'Tajawal', sans-serif",
                color: activeCategory === cat.id ? "#C9A84C" : "#333",
                borderBottom: activeCategory === cat.id ? "2.5px solid #C9A84C" : "2.5px solid transparent",
                transition: "all 0.2s",
              }}
            >{cat.label}</button>
          ))}
          <a href={waLink()} target="_blank" rel="noopener noreferrer" style={{
            padding: "14px 20px", fontSize: 13, fontWeight: 800,
            color: "#25D366", textDecoration: "none",
            borderBottom: "2.5px solid transparent",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Icon d={Icons.whatsapp} size={16} /> اطلب الآن
          </a>
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-search { display: none !important; }
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .mobile-search-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-search-btn { display: none !important; }
          .mobile-search-bar { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function MobileMenu({ open, onClose, activeCategory, setActiveCategory }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, animation: "fadeIn 0.2s" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, width: 280, height: "100%",
        background: "#fff", zIndex: 201, padding: 24,
        animation: "slideInLeft 0.3s ease",
        overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 20 }}>Armada</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Icon d={Icons.x} size={24} />
          </button>
        </div>
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", marginBottom: 12, letterSpacing: 2 }}>الأقسام</p>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => { setActiveCategory(cat.id); onClose(); }}
              style={{
                display: "block", width: "100%", textAlign: "right", background: "none",
                border: "none", cursor: "pointer", padding: "12px 0",
                fontSize: 15, fontWeight: activeCategory === cat.id ? 800 : 500,
                color: activeCategory === cat.id ? "#C9A84C" : "#333",
                borderBottom: "1px solid #F0F0F0", fontFamily: "'Tajawal', sans-serif",
              }}
            >{cat.label}</button>
          ))}
        </div>
        <a href={waLink()} target="_blank" rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", gap: 10, background: "#25D366",
            color: "#fff", padding: "14px 20px", borderRadius: 12,
            textDecoration: "none", fontWeight: 800, fontSize: 15,
          }}>
          <Icon d={Icons.whatsapp} size={22} fill="#fff" stroke="none" />
          تواصل واتساب
        </a>
        <div style={{ marginTop: 32, padding: 16, background: "#F7F7F7", borderRadius: 12 }}>
          <p style={{ fontSize: 12, color: "#666", lineHeight: 1.8 }}>
            <strong>أرمادا للعطور</strong><br />
            الرياض، المملكة العربية السعودية<br />
            <a href="tel:+966555098359" dir="ltr" style={{ color: "#C9A84C" }}>+966 55 509 8359</a>
          </p>
        </div>
      </div>
    </>
  );
}

function HeroBanner() {
  return (
    <section style={{ position: "relative", background: "#0A0A0A", overflow: "hidden", minHeight: 500 }}>
      {/* Background image */}
      <img src="/product-images/hero.png" alt="أرمادا" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", opacity: 0.35,
      }} />
      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.5) 70%, transparent)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1440, margin: "0 auto", padding: "80px 24px", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(201,168,76,0.5)", borderRadius: 50, padding: "8px 20px", marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A84C", display: "inline-block", animation: "pulse-gold 2s infinite" }} />
          <span style={{ color: "#C9A84C", fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>مجموعة 2025 الحصرية</span>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 20, textAlign: "right", maxWidth: 700 }}>
          الفخامة التي
          <br />
          <span style={{ color: "#C9A84C" }}>تختارها</span>
        </h1>

        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(14px, 1.5vw, 18px)", maxWidth: 520, lineHeight: 1.9, marginBottom: 40, textAlign: "right", fontWeight: 400 }}>
          بدائل عطرية نيش تضاهي جودة أرقى العطور العالمية.
          <br />ثبات فائق، نوتات دقيقة، وأسعار ذكية.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <a href="#products" style={{
            background: "#C9A84C", color: "#000", padding: "16px 40px",
            borderRadius: 50, textDecoration: "none", fontWeight: 800, fontSize: 15,
            display: "flex", alignItems: "center", gap: 10, transition: "all 0.3s",
          }}
          onMouseEnter={e => { e.target.style.background = "#B8953E"; e.target.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.target.style.background = "#C9A84C"; e.target.style.transform = "translateY(0)"; }}>
            تسوق المجموعة
            <Icon d={Icons.arrow_l} size={18} />
          </a>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" style={{
            border: "1.5px solid #25D366", color: "#25D366", padding: "16px 36px",
            borderRadius: 50, textDecoration: "none", fontWeight: 800, fontSize: 15,
            display: "flex", alignItems: "center", gap: 10, transition: "all 0.3s",
          }}>
            <Icon d={Icons.whatsapp} size={20} fill="#25D366" stroke="none" />
            استشارة مجانية
          </a>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ position: "relative", zIndex: 2, background: "rgba(201,168,76,0.12)", borderTop: "1px solid rgba(201,168,76,0.2)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "20px 24px", display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
          {[
            { num: "14", label: "عطراً حصرياً" },
            { num: "100%", label: "زيوت مستوردة" },
            { num: "EDP", label: "تركيز عالي" },
            { num: "24H", label: "ثبات مضمون" },
          ].map((s, i) => (
            <div key={i} style={{ flex: "1 1 120px", textAlign: "center", padding: "8px 20px", borderLeft: i > 0 ? "1px solid rgba(201,168,76,0.2)" : "none" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: "#C9A84C" }}>{s.num}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, onAddToCart, onQuickView }) {
  const [hovered, setHovered] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: 20,
        border: "1px solid", borderColor: hovered ? "rgba(201,168,76,0.4)" : "#EFEFEF",
        overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.04)",
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* Image container */}
      <div style={{ position: "relative", background: "#F8F8F8", overflow: "hidden", aspectRatio: "1/1" }}>
        {/* Tag */}
        {product.tag && (
          <div style={{
            position: "absolute", top: 14, right: 14, zIndex: 3,
            background: product.tagColor, color: product.tagColor === "#C9A84C" ? "#000" : "#fff",
            fontSize: 10, fontWeight: 800, padding: "5px 12px",
            borderRadius: 4, letterSpacing: 1, textTransform: "uppercase",
          }}>{product.tag}</div>
        )}
        {/* Discount badge */}
        <div style={{
          position: "absolute", top: 14, left: 14, zIndex: 3,
          background: "#C62828", color: "#fff",
          fontSize: 10, fontWeight: 800, padding: "5px 10px",
          borderRadius: 4,
        }}>-{discount}%</div>

        {/* Wishlist */}
        <button onClick={() => setWishlist(!wishlist)} style={{
          position: "absolute", top: 48, right: 14, zIndex: 3,
          background: "#fff", border: "none", cursor: "pointer",
          width: 36, height: 36, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "all 0.2s",
        }}>
          <Icon d={Icons.heart} size={16} fill={wishlist ? "#C62828" : "none"} stroke={wishlist ? "#C62828" : "#666"} strokeWidth={2} />
        </button>

        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%", height: "100%", objectFit: "contain", padding: 20,
            transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
        />

        {/* Hover overlay */}
        <div style={{
          position: "absolute", inset: 0, background: "rgba(10,10,10,0.55)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
          backdropFilter: "blur(2px)",
        }}>
          <button onClick={() => onQuickView(product)} style={{
            background: "#fff", color: "#000", border: "none", cursor: "pointer",
            padding: "12px 28px", borderRadius: 50, fontWeight: 700, fontSize: 13,
            display: "flex", alignItems: "center", gap: 8, width: 180, justifyContent: "center",
            fontFamily: "'Tajawal', sans-serif", transition: "all 0.2s",
          }}>
            <Icon d={Icons.eye} size={16} /> عرض سريع
          </button>
          <button onClick={handleAdd} style={{
            background: added ? "#25D366" : "#C9A84C", color: "#000", border: "none", cursor: "pointer",
            padding: "12px 28px", borderRadius: 50, fontWeight: 800, fontSize: 13,
            display: "flex", alignItems: "center", gap: 8, width: 180, justifyContent: "center",
            fontFamily: "'Tajawal', sans-serif", transition: "all 0.3s",
          }}>
            {added ? <><Icon d={Icons.check} size={16} /> تمت الإضافة</> : <><Icon d={Icons.plus} size={16} /> أضف للسلة</>}
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{product.brand}</span>
        <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, lineHeight: 1.3 }}>{product.name}</h3>

        {/* Inspired by */}
        <div style={{ background: "#F8F8F8", borderRadius: 8, padding: "8px 12px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#C9A84C", flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#666", fontWeight: 500 }}>بديل: <strong style={{ color: "#333" }}>{product.inspiredByAr}</strong></span>
        </div>

        {/* Notes */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
          {product.notesList.map(note => (
            <span key={note} style={{ fontSize: 10, background: "#F0F0F0", color: "#555", padding: "3px 10px", borderRadius: 50, fontWeight: 600 }}>{note}</span>
          ))}
        </div>

        {/* Price & CTA */}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#0A0A0A" }}>{product.price}</span>
            <span style={{ fontSize: 11, color: "#888", marginRight: 4 }}>ر.س</span>
            <span style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through", marginRight: 8 }}>{product.oldPrice}</span>
          </div>
          <button onClick={handleAdd} style={{
            background: added ? "#25D366" : "#0A0A0A",
            color: "#fff", border: "none", cursor: "pointer",
            padding: "10px 18px", borderRadius: 50, fontWeight: 700, fontSize: 12,
            fontFamily: "'Tajawal', sans-serif",
            display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.3s",
          }}>
            {added ? <Icon d={Icons.check} size={14} /> : <Icon d={Icons.bag} size={14} />}
            {added ? "تمت" : "أضف"}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickViewModal({ product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product);
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1500);
  };

  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300, animation: "fadeIn 0.2s", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        background: "#fff", borderRadius: 24, zIndex: 301,
        width: "min(95vw, 900px)", maxHeight: "90vh", overflow: "auto",
        animation: "fadeUp 0.3s ease",
        boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, left: 16, zIndex: 10,
          background: "#F0F0F0", border: "none", cursor: "pointer",
          width: 40, height: 40, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon d={Icons.x} size={18} />
        </button>

        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {/* Image */}
          <div style={{ flex: "1 1 300px", background: "#F7F7F7", borderRadius: "24px 0 0 24px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 320, padding: 32 }}>
            <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: 340, objectFit: "contain" }} />
          </div>

          {/* Info */}
          <div style={{ flex: "1 1 300px", padding: 36, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{product.brand}</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, marginBottom: 6 }}>{product.name}</h2>
            <p style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>{product.concentration}  ·  {product.size}</p>

            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900 }}>{product.price} <span style={{ fontSize: 14, fontWeight: 500 }}>ر.س</span></span>
              <span style={{ fontSize: 16, color: "#bbb", textDecoration: "line-through" }}>{product.oldPrice}</span>
              <span style={{ background: "#C62828", color: "#fff", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 4 }}>-{discount}%</span>
            </div>

            <div style={{ background: "#F8F8F8", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 6 }}>مستوحى من</p>
              <p style={{ fontSize: 15, fontWeight: 800 }}>{product.inspiredByAr}</p>
              <p style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{product.inspiredBy}</p>
            </div>

            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.9, marginBottom: 20 }}>{product.description}</p>

            {/* Notes */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>النوتات العطرية</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {product.notesList.map(n => (
                  <span key={n} style={{ background: "#F0F0F0", fontSize: 12, padding: "5px 14px", borderRadius: 50, fontWeight: 600 }}>{n}</span>
                ))}
              </div>
            </div>

            {/* Qty */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>الكمية:</span>
              <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1.5px solid #E0E0E0", borderRadius: 50, overflow: "hidden" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 16px", fontSize: 18 }}>−</button>
                <span style={{ padding: "8px 16px", fontWeight: 800, minWidth: 40, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 16px", fontSize: 18 }}>+</button>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleAdd} style={{
                flex: 1, background: added ? "#25D366" : "#0A0A0A", color: "#fff",
                border: "none", cursor: "pointer", padding: "16px 24px",
                borderRadius: 50, fontWeight: 800, fontSize: 15, fontFamily: "'Tajawal', sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.3s",
              }}>
                {added ? <><Icon d={Icons.check} size={18} /> تمت الإضافة!</> : <><Icon d={Icons.bag} size={18} /> أضف للسلة</>}
              </button>
              <a href={waLink(`أريد طلب: ${product.name}`)} target="_blank" rel="noopener noreferrer" style={{
                background: "#25D366", color: "#fff", padding: "16px 20px",
                borderRadius: 50, textDecoration: "none",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <Icon d={Icons.whatsapp} size={20} fill="#fff" stroke="none" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CartDrawer({ open, onClose, cartItems, onUpdateQty, onRemove }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const waMsg = `مرحباً، أريد طلب:\n${cartItems.map(i => `• ${i.name} × ${i.qty} = ${i.price * i.qty} ر.س`).join("\n")}\nالإجمالي: ${total} ر.س`;

  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 400, animation: "fadeIn 0.2s" }} />}
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100%", width: "min(420px, 100vw)",
        background: "#fff", zIndex: 401,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.15)",
      }}>
        {/* Header */}
        <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid #F0F0F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>سلة التسوق</h2>
            <p style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{cartItems.length} منتج</p>
          </div>
          <button onClick={onClose} style={{ background: "#F0F0F0", border: "none", cursor: "pointer", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={Icons.x} size={18} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
              <Icon d={Icons.bag} size={48} stroke="#ddd" />
              <p style={{ marginTop: 16, fontSize: 15, fontWeight: 600 }}>السلة فارغة</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>أضف بعض العطور الرائعة!</p>
            </div>
          ) : cartItems.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid #F8F8F8" }}>
              <div style={{ width: 80, height: 80, background: "#F7F7F7", borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{item.name}</p>
                <p style={{ fontSize: 11, color: "#C9A84C", fontWeight: 600, marginBottom: 8 }}>{item.price} ر.س</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => onUpdateQty(item.id, item.qty - 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #E0E0E0", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => onUpdateQty(item.id, item.qty + 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #E0E0E0", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>+</button>
                  <button onClick={() => onRemove(item.id)} style={{ marginRight: "auto", background: "none", border: "none", cursor: "pointer", color: "#C62828" }}>
                    <Icon d={Icons.trash} size={15} stroke="#C62828" />
                  </button>
                </div>
              </div>
              <div style={{ textAlign: "left", flexShrink: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 900 }}>{item.price * item.qty}</p>
                <p style={{ fontSize: 10, color: "#888" }}>ر.س</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{ padding: 24, borderTop: "1px solid #F0F0F0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#666" }}>المجموع الجزئي</span>
              <span style={{ fontWeight: 700 }}>{total} ر.س</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: "#666" }}>الشحن</span>
              <span style={{ fontWeight: 700, color: "#25D366" }}>مجاني</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, paddingTop: 14, borderTop: "1px solid #F0F0F0" }}>
              <span style={{ fontSize: 16, fontWeight: 800 }}>الإجمالي</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: "#C9A84C" }}>{total} ر.س</span>
            </div>
            <a href={waLink(waMsg)} target="_blank" rel="noopener noreferrer" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              background: "#25D366", color: "#fff", padding: "16px 24px",
              borderRadius: 50, textDecoration: "none", fontWeight: 800, fontSize: 16,
              boxShadow: "0 8px 24px rgba(37,211,102,0.35)",
            }}>
              <Icon d={Icons.whatsapp} size={22} fill="#fff" stroke="none" />
              إتمام الطلب عبر واتساب
            </a>
            <p style={{ textAlign: "center", fontSize: 11, color: "#888", marginTop: 10 }}>سيتم التواصل معك خلال دقائق</p>
          </div>
        )}
      </div>
    </>
  );
}

function FeaturesStrip() {
  const features = [
    { icon: Icons.star, title: "جودة مضمونة", sub: "زيوت عطرية مستوردة" },
    { icon: Icons.sparkle, title: "ثبات فائق", sub: "Eau de Parfum تركيز" },
    { icon: Icons.check, title: "توصيل سريع", sub: "جميع مناطق المملكة" },
    { icon: Icons.whatsapp, title: "دعم 24/7", sub: "عبر واتساب مباشرة" },
  ];
  return (
    <div style={{ background: "#F7F7F7", borderBottom: "1px solid #EFEFEF" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "28px 24px", display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
        {features.map((f, i) => (
          <div key={i} style={{ flex: "1 1 200px", display: "flex", alignItems: "center", gap: 14, padding: "12px 28px", borderLeft: i > 0 ? "1px solid #E0E0E0" : "none" }}>
            <div style={{ width: 44, height: 44, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", flexShrink: 0, color: "#C9A84C" }}>
              <Icon d={f.icon} size={20} stroke="#C9A84C" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 2 }}>{f.title}</p>
              <p style={{ fontSize: 11, color: "#888" }}>{f.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#0A0A0A", color: "#fff", padding: "60px 24px 32px" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div style={{ flex: "2 1 260px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, border: "2px solid #C9A84C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "#C9A84C" }}>AR</span>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 22, letterSpacing: 2 }}>ARMADA</span>
            </div>
            <p style={{ fontSize: 13, color: "#888", lineHeight: 1.9, maxWidth: 280, marginBottom: 24 }}>
              بدائل عطرية فاخرة مستوحاة من أرقى العطور العالمية، بزيوت عطرية مستوردة وتركيز عالي لثبات لا مثيل له.
            </p>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "#25D366", color: "#fff", padding: "12px 24px",
              borderRadius: 50, textDecoration: "none", fontWeight: 700, fontSize: 14,
            }}>
              <Icon d={Icons.whatsapp} size={20} fill="#fff" stroke="none" />
              +966 55 509 8359
            </a>
          </div>

          {/* Collections */}
          <div style={{ flex: "1 1 160px" }}>
            <h4 style={{ fontWeight: 800, marginBottom: 20, fontSize: 14, letterSpacing: 1, color: "#C9A84C" }}>المجموعات</h4>
            {["الرجالية", "النسائية", "للجنسين", "الشرقية", "العروض"].map(l => (
              <a key={l} href="#products" style={{ display: "block", color: "#888", fontSize: 13, marginBottom: 10, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#C9A84C"}
                onMouseLeave={e => e.target.style.color = "#888"}>{l}</a>
            ))}
          </div>

          {/* Info */}
          <div style={{ flex: "1 1 160px" }}>
            <h4 style={{ fontWeight: 800, marginBottom: 20, fontSize: 14, letterSpacing: 1, color: "#C9A84C" }}>معلومات</h4>
            {["من نحن", "سياسة الإرجاع", "الشحن والتوصيل", "الأسئلة الشائعة"].map(l => (
              <a key={l} href="#" style={{ display: "block", color: "#888", fontSize: 13, marginBottom: 10, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "#C9A84C"}
                onMouseLeave={e => e.target.style.color = "#888"}>{l}</a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid #222", paddingTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <p style={{ fontSize: 12, color: "#555" }}>© 2025 أرمادا. جميع الحقوق محفوظة.</p>
          <p style={{ fontSize: 12, color: "#555" }}>الرياض، المملكة العربية السعودية</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cart operations
  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) setCart(prev => prev.filter(i => i.id !== id));
    else setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, []);

  const removeItem = useCallback((id) => setCart(prev => prev.filter(i => i.id !== id)), []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // Filtered & sorted products
  const filtered = PRODUCTS
    .filter(p => activeCategory === "all" || p.category === activeCategory)
    .filter(p => !searchQuery || p.name.includes(searchQuery) || p.inspiredByAr.includes(searchQuery) || p.notes.includes(searchQuery))
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", minHeight: "100vh" }}>
      <AnnouncementBar />
      <Header
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <HeroBanner />
      <FeaturesStrip />

      {/* Products Section */}
      <section id="products" style={{ maxWidth: 1440, margin: "0 auto", padding: "60px 24px" }}>
        {/* Section header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 20, borderBottom: "1px solid #F0F0F0", paddingBottom: 24 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#C9A84C", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>مجموعتنا</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 900 }}>
              {activeCategory === "all" ? "جميع العطور" : CATEGORIES.find(c => c.id === activeCategory)?.label}
            </h2>
            <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>{filtered.length} منتج</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              background: "#F7F7F7", border: "1px solid #E0E0E0", borderRadius: 50,
              padding: "10px 20px", fontSize: 13, fontFamily: "'Tajawal', sans-serif",
              cursor: "pointer", outline: "none",
            }}>
              <option value="default">الترتيب الافتراضي</option>
              <option value="price-asc">السعر: الأقل أولاً</option>
              <option value="price-desc">السعر: الأعلى أولاً</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#888" }}>
            <p style={{ fontSize: 18, fontWeight: 700 }}>لا توجد نتائج</p>
            <p style={{ marginTop: 8, fontSize: 14 }}>جرب البحث بكلمة أخرى</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 28 }}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} onQuickView={setQuickView} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section style={{ background: "#0A0A0A", padding: "80px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#C9A84C", letterSpacing: 3, marginBottom: 16 }}>تواصل معنا مباشرة</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 52px)", color: "#fff", fontWeight: 900, marginBottom: 20 }}>
          هل تحتاج مساعدة في الاختيار؟
        </h2>
        <p style={{ color: "#888", maxWidth: 500, margin: "0 auto 36px", fontSize: 15, lineHeight: 1.9 }}>
          فريقنا المتخصص يساعدك في اختيار العطر المثالي الذي يناسب شخصيتك وذوقك.
        </p>
        <a href={waLink("مرحباً، أحتاج مساعدة في اختيار عطر مناسب")} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          background: "#25D366", color: "#fff",
          padding: "18px 44px", borderRadius: 50,
          textDecoration: "none", fontWeight: 800, fontSize: 16,
          boxShadow: "0 12px 40px rgba(37,211,102,0.3)",
          transition: "all 0.3s",
        }}>
          <Icon d={Icons.whatsapp} size={24} fill="#fff" stroke="none" />
          تحدث مع خبير العطور
        </a>
      </section>

      <Footer />

      {/* Floating WhatsApp */}
      <a href={waLink()} target="_blank" rel="noopener noreferrer" style={{
        position: "fixed", bottom: 28, left: 28, zIndex: 200,
        background: "#25D366", color: "#fff",
        width: 60, height: 60, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 32px rgba(37,211,102,0.5)",
        animation: "pulse-gold 3s infinite",
        textDecoration: "none",
        transition: "transform 0.3s",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
        <Icon d={Icons.whatsapp} size={28} fill="#fff" stroke="none" />
      </a>

      {/* Modals */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cartItems={cart} onUpdateQty={updateQty} onRemove={removeItem} />
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} onAddToCart={addToCart} />
    </div>
  );
}
