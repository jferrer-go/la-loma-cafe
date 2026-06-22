import { useState } from "react";
import { ShoppingBag, ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductCard, type Product } from "./components/ProductCard";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { Marquee } from "./components/Marquee";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import logoNew from "../imports/La_loma_coffee_V2.1-01-1.png";
import product1 from "../imports/La_loma_coffee_V2.0-03.png";
import product2 from "../imports/La_loma_coffee_V2.0-04.png";
import product3 from "../imports/La_loma_coffee_V2.1-01.png";

export interface CartItem {
  id: string; name: string; region: string;
  price: number; grind: string; size: string; qty: number; image: string;
}

const C = {
  ink:     "#241A12",
  cream:   "#F4EFE3",
  paper:   "#FBF8F0",
  red:     "#9A0B0B",
  redDark: "#7C0808",
  brass:   "#C9A24B",
  mute:    "#8A8067",
} as const;

// ── Type system ────────────────────────────────────────────────
// display  → Cormorant Garamond 600/700 (headlines, numbers, prices)
// body     → Bricolage Grotesque 400/600 (paragraphs, buttons, UI)
// hand     → Caveat 700                (accents, pull quotes)
// label    → Courier Prime 700 caps    (overlines, tags, metadata)

const label: React.CSSProperties = {
  fontFamily: "'Courier Prime', monospace",
  fontSize: "10px", fontWeight: 700,
  letterSpacing: "0.22em", textTransform: "uppercase",
};

const HERO_IMG   = "https://images.unsplash.com/photo-1662559100586-59d3ca30a7e8?w=1400&q=90&fit=crop&crop=center";
const CHERRY_IMG = "https://images.unsplash.com/photo-1586095516671-d085ff58cdd4?w=1800&q=90&fit=crop";
const POUR_IMG   = "https://images.unsplash.com/photo-1522012188892-24beb302783d?w=1800&q=90&fit=crop";

const products: Product[] = [
  { id: "la-cima",       name: "La Cima",       region: "Brazil Cerrado + India Robusta", description: "The flagship. Café cubano, elevated — dark chocolate, molasses, and toasted almond, with a full body and a crema that means it.", note: "Dark Chocolate · Molasses · Almond", price: 19.0, roast: "dark",   image: product1 },
  { id: "la-dominicana", name: "La Dominicana", region: "Dominican Republic",              description: "Smooth and sweet with a soft cocoa finish. The island in a cup — bright mornings and slow afternoons.",                            note: "Cocoa · Brown Sugar · Soft Citrus",  price: 18.0, roast: "medium", image: product2 },
  { id: "el-primero",    name: "El Primero",    region: "Brazil Sul de Minas",             description: "The everyday devotion. Balanced, nutty, and gently sweet — the dependable first cup, done right.",                                note: "Hazelnut · Caramel · Milk Chocolate", price: 17.0, roast: "medium", image: product3 },
];

function cartId(pid: string, grind: string, size: string) { return `${pid}--${grind}--${size}`; }

export default function App() {
  const [cartOpen,     setCartOpen]     = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartItems,    setCartItems]    = useState<CartItem[]>([]);

  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);

  const addToCart = (p: Product, grind: string, size: string) => {
    const mult: Record<string, number> = { "250g": 1, "500g": 1.8, "1kg": 3.2 };
    const price = p.price * (mult[size] ?? 1);
    const id = cartId(p.id, grind, size);
    setCartItems((prev) => {
      const ex = prev.find((i) => i.id === id);
      if (ex) return prev.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id, name: p.name, region: p.region, price, grind, size, qty: 1, image: p.image }];
    });
    setCartOpen(true);
  };

  const removeItem = (id: string) => setCartItems((p) => p.filter((i) => i.id !== id));
  const updateQty  = (id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return; }
    setCartItems((p) => p.map((i) => i.id === id ? { ...i, qty } : i));
  };

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "'Bricolage Grotesque', sans-serif", overflowX: "hidden" }}>

      {/* ── NAV ─────────────────────────────────────────────────
           Always red → white logo is always crisp, no filter needed.
      ──────────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        height: "64px", padding: "0 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: C.red,
        boxShadow: "0 1px 0 rgba(0,0,0,0.15)",
      }}>
        {/* Logo — white on red, no filter, generous size */}
        <img src={logoNew} alt="La Loma Coffee" style={{ height: "46px", display: "block" }} />

        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {["Shop", "Story", "Origin"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              ...label, color: "rgba(244,239,227,0.65)",
              textDecoration: "none", transition: "color 0.15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.cream)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(244,239,227,0.65)")}
            >{item}</a>
          ))}

          <button onClick={() => setCartOpen(true)} style={{
            display: "flex", alignItems: "center", gap: "7px",
            background: "transparent", border: "1.5px solid rgba(244,239,227,0.5)",
            borderRadius: "999px", padding: "7px 18px", cursor: "pointer",
            fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "16px",
            fontWeight: 600, color: C.cream,
            transition: "background 0.15s, border-color 0.15s", position: "relative",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(244,239,227,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <ShoppingBag size={15} />
            Bag
            {totalQty > 0 && (
              <span style={{
                position: "absolute", top: "-7px", right: "-7px",
                background: C.brass, borderRadius: "999px",
                width: "20px", height: "20px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Cormorant Garamond', serif", fontSize: "11px",
                fontWeight: 700, color: C.ink,
              }}>{totalQty}</span>
            )}
          </button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        height: "calc(100vh - 64px)",
        display: "grid", gridTemplateColumns: "55fr 45fr",
        overflow: "hidden",
      }} className="hero-grid">

        {/* Left: Typography panel */}
        <div style={{
          background: C.cream,
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "0 80px", position: "relative",
        }}>

          <p style={{ ...label, color: C.mute, margin: "0 0 24px" }}>
            Small Batch · Roasted to Order
          </p>

          {/* Main headline — Cormorant Garamond, italic for warmth */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(52px, 5.8vw, 88px)",
            fontWeight: 700,
            fontStyle: "italic",
            color: C.ink,
            lineHeight: 1.0,
            margin: "0 0 28px",
            letterSpacing: "-0.02em",
          }}>
            Strong,<br />
            <span style={{ fontStyle: "normal", color: C.red }}>sweet,</span><br />
            roasted<br />by hand.
          </h1>

          <div style={{ width: "48px", height: "2px", background: C.brass, margin: "0 0 24px" }} />

          <p style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "16px", color: C.mute,
            lineHeight: 1.8, margin: "0 0 40px", maxWidth: "360px",
          }}>
            Café cubano, elevated. Specialty beans roasted dark in small batches — and roasted to order, so every bag ships fresh.
          </p>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <a href="#shop" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "13px 28px", borderRadius: "999px",
              background: C.ink, color: C.cream,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "16px", fontWeight: 600,
              textDecoration: "none", transition: "background 0.2s, transform 0.15s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.red; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.ink; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Shop the Collection <ArrowRight size={15} />
            </a>
            <a href="#story" style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "16px", fontWeight: 500, color: C.mute,
              textDecoration: "none",
              borderBottom: "1px solid transparent",
              paddingBottom: "2px",
              transition: "color 0.15s, border-color 0.15s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.ink; e.currentTarget.style.borderBottomColor = C.ink; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.mute; e.currentTarget.style.borderBottomColor = "transparent"; }}
            >
              Our Story
            </a>
          </div>
        </div>

        {/* Right: Full-height photo */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <ImageWithFallback
            src={HERO_IMG}
            alt="Freshly roasted coffee beans"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
          />
          {/* Left edge fade */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(244,239,227,0.25) 0%, transparent 20%)" }} />

          {/* Floating stat card */}
          <div style={{
            position: "absolute", top: "40px", right: "28px",
            background: "rgba(244,239,227,0.93)", backdropFilter: "blur(12px)",
            borderRadius: "14px", padding: "16px 20px", textAlign: "right",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}>
            <p style={{ ...label, color: C.mute, margin: "0 0 4px" }}>Roasted to Order</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "44px", fontWeight: 700, color: C.ink, margin: "0 0 2px", lineHeight: 1 }}>Fresh</p>
            <p style={{ ...label, color: C.red, margin: 0 }}>Small Batch</p>
          </div>

          {/* Altitude pill */}
          <div style={{
            position: "absolute", bottom: "28px", right: "28px",
            background: C.red, borderRadius: "999px", padding: "9px 20px",
          }}>
            <span style={{ ...label, color: C.cream }}>Roasted Dark · 2nd Crack</span>
          </div>
        </div>
      </section>

      {/* ── REGION STRIP ─────────────────────────────────────── */}
      <div style={{
        background: C.ink, padding: "16px 48px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "0",
      }}>
        {["Cafecito", "Colada", "Espresso", "Moka", "Cortadito"].map((r, i) => (
          <div key={r} style={{ display: "flex", alignItems: "center" }}>
            {i > 0 && <div style={{ width: "1px", height: "10px", background: "rgba(244,239,227,0.18)", margin: "0 28px" }} />}
            <span style={{ ...label, color: "rgba(244,239,227,0.5)" }}>{r}</span>
          </div>
        ))}
      </div>

      {/* ── MARQUEE ──────────────────────────────────────────── */}
      <Marquee />

      {/* ── SHOP ─────────────────────────────────────────────── */}
      <section id="shop" style={{ background: "linear-gradient(160deg, #2b1f16 0%, #241A12 55%)", padding: "100px 48px 120px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

          <div style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            marginBottom: "64px", flexWrap: "wrap", gap: "20px",
          }}>
            <div>
              <p style={{ ...label, color: C.brass, margin: "0 0 14px" }}>The Collection</p>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "44px", fontWeight: 700, color: C.cream,
                margin: 0, lineHeight: 1.05,
              }}>
                Three Coffees.<br />
                <em style={{ color: C.brass, fontWeight: 700 }}>One Ritual.</em>
              </h2>
            </div>
            <p style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "16px", color: "rgba(244,239,227,0.5)",
              lineHeight: 1.8, maxWidth: "320px", margin: 0,
            }}>
              Every bag roasted by hand, in small batches, to order. Free shipping over $50.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
            {products.map((p) => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)}
          </div>
        </div>
      </section>

      {/* ── CHERRY BAND ──────────────────────────────────────── */}
      <section id="story" style={{ position: "relative", height: "72vh", overflow: "hidden" }}>
        <ImageWithFallback
          src={CHERRY_IMG}
          alt="Coffee cherries ripening on the branch"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(36,26,18,0.05) 0%, rgba(36,26,18,0.82) 100%)" }} />
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-end",
          padding: "0 48px 72px", textAlign: "center",
        }}>
          <p style={{ ...label, color: "rgba(244,239,227,0.5)", margin: "0 0 18px" }}>
            Small Batch · Roasted by Hand
          </p>
          <p style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "44px", fontWeight: 700, color: C.cream,
            margin: "0 0 6px", lineHeight: 1.1, maxWidth: "640px",
          }}>
            Roasted dark, by hand, on purpose.
          </p>
          <p style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "36px", fontWeight: 700, color: C.brass,
            margin: "0 0 36px", lineHeight: 1.1,
          }}>
            That's the whole secret.
          </p>
          <a href="#shop" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "12px 28px", borderRadius: "999px",
            border: "1.5px solid rgba(244,239,227,0.5)", color: C.cream,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "16px", fontWeight: 600,
            textDecoration: "none",
            background: "rgba(244,239,227,0.08)", backdropFilter: "blur(8px)",
            transition: "background 0.2s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(244,239,227,0.18)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(244,239,227,0.08)")}
          >
            Shop the Coffees <ArrowUpRight size={15} />
          </a>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────── */}
      <section id="origin" style={{ background: C.cream, padding: "100px 48px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...label, color: C.mute, margin: "0 0 14px" }}>How it works</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "44px", fontWeight: 700, color: C.ink,
            margin: "0 0 72px", lineHeight: 1.05,
          }}>
            From green bean to your cup.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }} className="process-grid">
            {[
              { n: "01", title: "Quality Green Beans", body: "We start with carefully selected specialty-grade beans — chosen for the sweet, chocolatey, full-bodied profile that defines a great Cuban-style cup." },
              { n: "02", title: "Roasted by Hand",     body: "Small batches, roasted dark and patient to second crack. Dialed in by hand, one batch at a time — no automation, no shortcuts." },
              { n: "03", title: "Roasted to Order",    body: "Your bag is roasted after you order, then shipped fresh with the roast date on the label. Never sitting in a warehouse." },
            ].map(({ n, title, body }, i) => (
              <div key={n} style={{
                padding: `0 ${i < 2 ? "48px" : "0"} 0 ${i > 0 ? "48px" : "0"}`,
                borderLeft: i > 0 ? "1px solid rgba(36,26,18,0.1)" : "none",
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "36px", fontWeight: 700, color: C.brass,
                  margin: "0 0 20px", lineHeight: 1,
                }}>{n}</p>
                <div style={{ width: "28px", height: "2px", background: C.brass, margin: "0 0 18px" }} />
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "22px", fontWeight: 700, color: C.ink,
                  margin: "0 0 14px", lineHeight: 1.15,
                }}>{title}</h3>
                <p style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "16px", color: C.mute, lineHeight: 1.8, margin: 0,
                }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POUR-OVER BAND ───────────────────────────────────── */}
      <section style={{ position: "relative", height: "56vh", overflow: "hidden" }}>
        <ImageWithFallback
          src={POUR_IMG}
          alt="Brewing specialty coffee"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(36,26,18,0.6)" }} />
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 48px",
        }}>
          <p style={{ ...label, color: "rgba(244,239,227,0.45)", margin: "0 0 18px" }}>The morning ritual</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 700, color: C.cream,
            margin: 0, lineHeight: 1.15, maxWidth: "700px",
          }}>
            A great cup starts long before the brew.
          </h2>
        </div>
      </section>

      {/* ── STORY + STATS ─────────────────────────────────────── */}
      <section style={{ background: C.paper, padding: "100px 48px" }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "88px", alignItems: "start",
        }} className="story-grid">

          <div>
            <p style={{ ...label, color: C.red, margin: "0 0 20px" }}>Our Story</p>
            <h2 style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "44px", fontWeight: 700, color: C.ink,
              margin: "0 0 28px", lineHeight: 1.05,
            }}>
              Strong like home.<br />Sweet like<br />memory.
            </h2>
            <div style={{ width: "36px", height: "2px", background: C.brass, margin: "0 0 28px" }} />
            <p style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "16px", color: C.mute, lineHeight: 1.85, margin: "0 0 18px",
            }}>
              La Loma is café cubano, elevated. The strong, sweet cup so many of us grew up on — made the way it always should have been: with specialty-grade beans and real care.
            </p>
            <p style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "16px", color: C.mute, lineHeight: 1.85, margin: "0 0 40px",
            }}>
              We roast dark and by hand, in small batches, to order. The same strength. The same sweetness. None of the compromise — just a better version of the cup you already love.
            </p>
            <a href="#shop" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "13px 28px", borderRadius: "999px",
              background: C.ink, color: C.cream,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "16px", fontWeight: 600,
              textDecoration: "none", transition: "background 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.red)}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.ink)}
            >
              Browse the Collection <ArrowRight size={15} />
            </a>
          </div>

          {/* Stats */}
          <div>
            {[
              { n: "Small", l: "Batch Roasted",    sub: "Dialed in by hand, one batch at a time" },
              { n: "Fresh", l: "Roasted to Order",  sub: "Roasted after you order, never warehoused" },
              { n: "Dark",  l: "Cuban Style",       sub: "Roasted to second crack for a full, sweet cup" },
              { n: "100%",  l: "Specialty Grade",   sub: "Quality green beans, chosen with care" },
            ].map(({ n, l, sub }, i) => (
              <div key={l} style={{
                display: "flex", gap: "24px", alignItems: "flex-start",
                padding: "28px 0",
                borderTop: i > 0 ? "1px solid rgba(36,26,18,0.1)" : "none",
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "36px", fontWeight: 700, color: C.red,
                  margin: 0, lineHeight: 1, minWidth: "84px",
                }}>{n}</p>
                <div>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "20px", fontWeight: 700, color: C.ink,
                    margin: "0 0 5px", lineHeight: 1.2,
                  }}>{l}</p>
                  <p style={{ ...label, color: C.mute, margin: 0 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background: C.ink, padding: "72px 48px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", marginBottom: "60px",
            flexWrap: "wrap", gap: "40px",
          }}>
            <div>
              {/* White logo on dark — no filter needed, full size */}
              <img src={logoNew} alt="La Loma Coffee" style={{ height: "52px", display: "block", marginBottom: "16px" }} />
              <p style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "20px", fontWeight: 700,
                color: "rgba(244,239,227,0.4)", margin: 0,
              }}>
                Strong like home. Sweet like memory.
              </p>
            </div>
            <div style={{ display: "flex", gap: "56px", flexWrap: "wrap" }}>
              {[
                { heading: "Shop", links: ["All Coffees", "Light Roast", "Medium Roast", "Dark Roast", "Subscriptions"] },
                { heading: "Company", links: ["Our Story", "How We Roast", "Wholesale", "Contact"] },
              ].map(({ heading, links }) => (
                <div key={heading}>
                  <p style={{ ...label, color: "rgba(244,239,227,0.35)", margin: "0 0 16px" }}>{heading}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {links.map((l) => (
                      <a key={l} href="#" style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "16px", color: "rgba(244,239,227,0.55)",
                        textDecoration: "none", transition: "color 0.15s",
                      }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = C.cream)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(244,239,227,0.55)")}
                      >{l}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            borderTop: "1px solid rgba(244,239,227,0.08)",
            paddingTop: "28px",
            display: "flex", justifyContent: "space-between",
            flexWrap: "wrap", gap: "10px",
          }}>
            <p style={{ ...label, color: "rgba(244,239,227,0.28)", margin: 0 }}>
              © 2026 La Loma Coffee · All rights reserved
            </p>
            <p style={{ ...label, color: "rgba(244,239,227,0.28)", margin: 0 }}>
              Small Batch · Roasted by Hand
            </p>
          </div>
        </div>
      </footer>

      <CartDrawer
        isOpen={cartOpen} onClose={() => setCartOpen(false)}
        items={cartItems} onRemoveItem={removeItem}
        onUpdateQty={updateQty}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
      />
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => { setCheckoutOpen(false); setCartItems([]); }}
        items={cartItems}
      />

      <style>{`
        html { scroll-behavior: smooth; }
        @media (max-width: 900px) {
          .hero-grid    { grid-template-columns: 1fr !important; height: auto !important; }
          .process-grid { grid-template-columns: 1fr !important; }
          .story-grid   { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
        @media (max-width: 600px) {
          .hero-grid > div:last-child { height: 45vw; }
        }
      `}</style>
    </div>
  );
}
