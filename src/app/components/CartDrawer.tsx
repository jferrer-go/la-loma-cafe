import { X, Trash2, ShoppingBag } from "lucide-react";
import type { CartItem } from "../App";

const C = {
  ink: "#241A12", cream: "#F4EFE3", paper: "#FBF8F0",
  red: "#9A0B0B", redDark: "#7C0808", mute: "#8A8067", border: "#D8CFB8",
} as const;

const overline: React.CSSProperties = {
  fontFamily: "'Courier Prime', monospace",
  fontSize: "10px", fontWeight: 700,
  letterSpacing: "0.2em", textTransform: "uppercase",
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onCheckout: () => void;
}

export function CartDrawer({ isOpen, onClose, items, onRemoveItem, onUpdateQty, onCheckout }: CartDrawerProps) {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(36,26,18,0.45)", zIndex: 40,
        opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "all" : "none", transition: "opacity 0.3s",
      }} />

      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px, 100vw)",
        background: C.ink, zIndex: 50,
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.3)",
      }}>

        {/* Header */}
        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(244,239,227,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShoppingBag size={18} color={C.cream} />
            {/* lg panel title */}
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 700, color: C.cream }}>Your Bag</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(244,239,227,0.1)", border: "none", borderRadius: "999px", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color={C.cream} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {items.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "200px", gap: "12px" }}>
              <ShoppingBag size={36} color="rgba(244,239,227,0.25)" />
              {/* sm body */}
              <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "16px", color: "rgba(244,239,227,0.5)", textAlign: "center", margin: 0, lineHeight: 1.6 }}>
                Your bag is empty.<br />Start exploring our beans.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {items.map((item) => (
                <div key={item.id} style={{ background: C.paper, borderRadius: "12px", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <img src={item.image} alt={item.name} style={{ width: "52px", height: "52px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* md item name */}
                    <p style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", fontWeight: 700, color: C.ink, margin: "0 0 2px", lineHeight: 1.1 }}>
                      {item.name}
                    </p>
                    {/* xs meta */}
                    <p style={{ ...overline, color: C.mute, letterSpacing: "0.15em", margin: "0 0 10px" }}>
                      {item.grind} · {item.size}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {/* qty controls */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button onClick={() => onUpdateQty(item.id, item.qty - 1)} style={qtyBtn}>−</button>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 700, color: C.ink, minWidth: "18px", textAlign: "center" }}>
                          {item.qty}
                        </span>
                        <button onClick={() => onUpdateQty(item.id, item.qty + 1)} style={qtyBtn}>+</button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {/* sm price */}
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 700, color: C.ink }}>
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                        <button onClick={() => onRemoveItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex" }}>
                          <Trash2 size={13} color={C.mute} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(244,239,227,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              {/* xs label */}
              <span style={{ ...overline, color: "rgba(244,239,227,0.55)" }}>Total</span>
              {/* xl total */}
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 700, color: C.cream }}>
                ${total.toFixed(2)}
              </span>
            </div>
            <button onClick={onCheckout} style={{
              width: "100%", padding: "13px", borderRadius: "999px", border: "none",
              background: C.red, color: C.cream,
              fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "16px", fontWeight: 600,
              cursor: "pointer", transition: "background 0.15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.redDark)}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.red)}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const qtyBtn: React.CSSProperties = {
  width: "26px", height: "26px", borderRadius: "999px",
  border: "1.5px solid #D8CFB8", background: "transparent",
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  fontFamily: "'Fredoka', sans-serif", fontSize: "16px", color: "#241A12",
};
