import { useState } from "react";
import logoNew from "../../imports/La_loma_coffee_V2.1-01-1.png";

export interface Product {
  id: string;
  name: string;
  region: string;
  description: string;
  note: string;
  price: number;
  roast: "light" | "medium" | "dark";
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, grind: string, size: string) => void;
}

const grindOptions = ["Whole Bean", "Coarse", "Medium", "Fine", "Espresso"];
const sizeOptions  = ["250g", "500g", "1kg"];
const roastLevel: Record<string, number> = { light: 1, medium: 2, dark: 3 };

const C = {
  ink: "#241A12", cream: "#F4EFE3", paper: "#FBF8F0",
  red: "#9A0B0B", redDark: "#7C0808", mute: "#8A8067", border: "#D8CFB8",
} as const;

// xs overline style — shared across labels in this component
const overline: React.CSSProperties = {
  fontFamily: "'Courier Prime', monospace",
  fontSize: "10px", fontWeight: 700,
  letterSpacing: "0.2em", textTransform: "uppercase",
};

function CoffeeBeanIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <ellipse cx="11" cy="11" rx="7" ry="10"
        fill={filled ? C.ink : "none"} stroke={C.ink} strokeWidth="1.5"
        transform="rotate(-20 11 11)" />
      <path d="M11 3.5 Q14.5 11 11 18.5"
        stroke={filled ? C.paper : C.ink} strokeWidth="1.2"
        strokeLinecap="round" fill="none" transform="rotate(-20 11 11)" />
    </svg>
  );
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedGrind, setSelectedGrind] = useState("Whole Bean");
  const [selectedSize,  setSelectedSize]  = useState("250g");
  const [showOptions,   setShowOptions]   = useState(false);

  const mult: Record<string, number> = { "250g": 1, "500g": 1.8, "1kg": 3.2 };
  const displayPrice = product.price * (mult[selectedSize] ?? 1);
  const filled = roastLevel[product.roast];

  const handleBuy = () => {
    if (!showOptions) { setShowOptions(true); return; }
    onAddToCart(product, selectedGrind, selectedSize);
    setShowOptions(false);
  };

  return (
    <div style={{ background: "#5A6336", borderRadius: "18px", boxShadow: "0 18px 40px rgba(0,0,0,0.28)", padding: "12px" }}>
      <div style={{ background: C.paper, borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.10)", overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* Header — xs overline text */}
        <div style={{ background: C.red, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src={logoNew} alt="La Loma Coffee" style={{ height: "36px" }} />
          <p style={{ ...overline, color: C.cream, margin: 0, lineHeight: 1.8, textAlign: "right" }}>
            Small Batch<br />Specialty<br />Coffee
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 22px 22px", flex: 1, display: "flex", flexDirection: "column" }}>

          {/* 2xl product name + roast beans */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
            <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: "40px", fontWeight: 700, color: C.ink, margin: 0, lineHeight: 1.0, flex: 1 }}>
              {product.name}
            </h3>
            <div style={{ display: "flex", gap: "3px", paddingTop: "8px", flexShrink: 0 }}>
              {[1, 2, 3].map((l) => <CoffeeBeanIcon key={l} filled={l <= filled} />)}
            </div>
          </div>

          {/* xs region */}
          <p style={{ ...overline, color: C.mute, margin: "0 0 16px" }}>{product.region}</p>

          {/* sm description */}
          <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "16px", color: C.ink, lineHeight: 1.65, margin: "0 0 12px", flex: 1 }}>
            {product.description}
          </p>

          {/* md note */}
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", fontWeight: 700, color: C.red, margin: "0 0 20px", lineHeight: 1.2 }}>
            {product.note}
          </p>

          {/* Options drawer */}
          <div style={{ maxHeight: showOptions ? "220px" : "0", overflow: "hidden", transition: "max-height 0.3s ease" }}>
            <div style={{ paddingBottom: "16px" }}>
              <p style={{ ...overline, color: C.mute, margin: "0 0 7px" }}>Size</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
                {sizeOptions.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)} style={chip(selectedSize === s)}>{s}</button>
                ))}
              </div>
              <p style={{ ...overline, color: C.mute, margin: "0 0 7px" }}>Grind</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {grindOptions.map((g) => (
                  <button key={g} onClick={() => setSelectedGrind(g)} style={chip(selectedGrind === g)}>{g}</button>
                ))}
              </div>
            </div>
          </div>

          {/* xl price + sm button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "32px", fontWeight: 700, color: C.ink, lineHeight: 1 }}>
              ${displayPrice.toFixed(0)}
            </span>
            <button onClick={handleBuy} style={{
              fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "16px", fontWeight: 600,
              padding: "11px 26px", borderRadius: "999px", border: "none",
              background: C.red, color: C.cream, cursor: "pointer", transition: "background 0.15s, transform 0.1s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.redDark; e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.red;     e.currentTarget.style.transform = "scale(1)"; }}
            >
              {showOptions ? "Add to Bag" : "Buy a bag"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// xs chip text
const chip = (active: boolean): React.CSSProperties => ({
  fontFamily: "'Courier Prime', monospace",
  fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em",
  padding: "5px 12px", borderRadius: "999px",
  border: `1.5px solid ${active ? "#9A0B0B" : "#D8CFB8"}`,
  background: active ? "#9A0B0B" : "transparent",
  color: active ? "#F4EFE3" : "#241A12",
  cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" as const,
});
