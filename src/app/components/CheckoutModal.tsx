import { useState } from "react";
import { X, Check } from "lucide-react";
import type { CartItem } from "../App";

const C = {
  ink: "#241A12", cream: "#F4EFE3", paper: "#FBF8F0",
  red: "#9A0B0B", redDark: "#7C0808", brass: "#C9A24B", mute: "#8A8067", border: "#D8CFB8",
} as const;

const overline: React.CSSProperties = {
  fontFamily: "'Courier Prime', monospace",
  fontSize: "10px", fontWeight: 700,
  letterSpacing: "0.2em", textTransform: "uppercase",
};

// sm input
const inputStyle: React.CSSProperties = {
  width: "100%", background: C.paper,
  border: `1.5px solid ${C.border}`, borderRadius: "9px", padding: "10px 14px",
  fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "16px", color: C.ink,
  outline: "none", boxSizing: "border-box",
};

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
}

export function CheckoutModal({ isOpen, onClose, items }: CheckoutModalProps) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    address: "", city: "", zip: "", country: "",
    cardNumber: "", expiry: "", cvv: "",
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping  = subtotal > 50 ? 0 : 5.99;
  const total     = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div style={{ position: "fixed", inset: 0, background: C.cream, zIndex: 60, overflowY: "auto", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{
        padding: "18px 32px", borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: C.cream, position: "sticky", top: 0, zIndex: 10,
      }}>
        {/* lg panel title */}
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 700, color: C.ink }}>Checkout</span>
        <button onClick={onClose} style={{ background: "rgba(36,26,18,0.08)", border: "none", borderRadius: "999px", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <X size={16} color={C.ink} />
        </button>
      </div>

      {submitted ? (
        /* ── Success ── */
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", gap: "20px" }}>
          <div style={{ width: "68px", height: "68px", borderRadius: "999px", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={32} color={C.cream} />
          </div>
          {/* xl heading */}
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 700, color: C.ink, margin: 0, textAlign: "center" }}>
            Order Placed!
          </h2>
          {/* lg Caveat */}
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: "24px", fontWeight: 700, color: C.red, margin: 0, textAlign: "center" }}>
            Your beans are on their way ☕
          </p>
          {/* sm body */}
          <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "16px", color: C.mute, textAlign: "center", maxWidth: "380px", lineHeight: 1.7, margin: 0 }}>
            We've sent a confirmation to your email. Expect your order within 3–5 business days.
          </p>
          <button onClick={onClose} style={{
            padding: "13px 32px", borderRadius: "999px", border: "none",
            background: C.red, color: C.cream,
            fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "16px", fontWeight: 600,
            cursor: "pointer", marginTop: "8px", transition: "background 0.15s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.redDark)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.red)}
          >
            Back to Shop
          </button>
        </div>
      ) : (
        /* ── Form + Summary ── */
        <div style={{
          display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,400px)",
          flex: 1, maxWidth: "1100px", margin: "0 auto", width: "100%",
          padding: "40px 32px", alignItems: "start", boxSizing: "border-box",
        }} className="checkout-grid">

          {/* Left: Form */}
          <form onSubmit={handleSubmit} style={{ paddingRight: "48px" }}>
            {/* md sub-heading */}
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: C.ink, margin: "0 0 20px" }}>
              Shipping Information
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <Field label="First Name"><input name="firstName" value={form.firstName} onChange={handleChange} required style={inputStyle} placeholder="Maria" /></Field>
              <Field label="Last Name"> <input name="lastName"  value={form.lastName}  onChange={handleChange} required style={inputStyle} placeholder="García" /></Field>
            </div>
            <div style={{ marginBottom: "14px" }}>
              <Field label="Email"><input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="maria@example.com" /></Field>
            </div>
            <div style={{ marginBottom: "14px" }}>
              <Field label="Address"><input name="address" value={form.address} onChange={handleChange} required style={inputStyle} placeholder="123 Loma Drive" /></Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "36px" }}>
              <Field label="City">    <input name="city"    value={form.city}    onChange={handleChange} required style={inputStyle} placeholder="Bogotá" /></Field>
              <Field label="ZIP">     <input name="zip"     value={form.zip}     onChange={handleChange} required style={inputStyle} placeholder="11001" /></Field>
              <Field label="Country"> <input name="country" value={form.country} onChange={handleChange} required style={inputStyle} placeholder="United States" /></Field>
            </div>

            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: C.ink, margin: "0 0 20px" }}>
              Payment Details
            </h3>
            <div style={{ marginBottom: "14px" }}>
              <Field label="Card Number"><input name="cardNumber" value={form.cardNumber} onChange={handleChange} required style={inputStyle} placeholder="4242 4242 4242 4242" maxLength={19} /></Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "36px" }}>
              <Field label="Expiry"><input name="expiry" value={form.expiry} onChange={handleChange} required style={inputStyle} placeholder="MM / YY" maxLength={7} /></Field>
              <Field label="CVV">   <input name="cvv"    value={form.cvv}    onChange={handleChange} required style={inputStyle} placeholder="123"     maxLength={4} /></Field>
            </div>

            <button type="submit" style={{
              width: "100%", padding: "13px", borderRadius: "999px", border: "none",
              background: C.red, color: C.cream,
              fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "16px", fontWeight: 600,
              cursor: "pointer", transition: "background 0.15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.redDark)}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.red)}
            >
              Place Order · ${total.toFixed(2)}
            </button>
          </form>

          {/* Right: Order Summary */}
          <div style={{ background: C.ink, borderRadius: "18px", padding: "28px", position: "sticky", top: "90px" }}>
            {/* md sub-heading */}
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: C.cream, margin: "0 0 20px" }}>
              Order Summary
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <img src={item.image} alt={item.name} style={{ width: "44px", height: "44px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* md item name */}
                    <p style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", fontWeight: 700, color: C.cream, margin: 0, lineHeight: 1.1 }}>
                      {item.name}
                    </p>
                    {/* xs meta */}
                    <p style={{ ...overline, letterSpacing: "0.15em", color: "rgba(244,239,227,0.45)", margin: 0 }}>
                      {item.size} · {item.grind} · ×{item.qty}
                    </p>
                  </div>
                  {/* sm price */}
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 600, color: C.cream, whiteSpace: "nowrap" }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid rgba(244,239,227,0.1)", paddingTop: "16px" }}>
              {[
                { label: "Subtotal", value: `$${subtotal.toFixed(2)}` },
                { label: "Shipping", value: shipping === 0 ? "Free" : `$${shipping.toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ ...overline, color: "rgba(244,239,227,0.45)" }}>{label}</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 600, color: C.cream }}>{value}</span>
                </div>
              ))}
              {/* xl total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                <span style={{ ...overline, color: C.cream }}>Total</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 700, color: C.brass }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {subtotal > 0 && subtotal <= 50 && (
              /* md Caveat accent */
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", fontWeight: 700, color: C.brass, marginTop: "14px", textAlign: "center" }}>
                Add ${(50 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .checkout-grid{grid-template-columns:1fr!important;padding:24px 16px!important}
          .checkout-grid>form{padding-right:0!important;margin-bottom:32px}
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        fontFamily: "'Courier Prime', monospace", fontSize: "10px", fontWeight: 700,
        letterSpacing: "0.2em", textTransform: "uppercase", color: "#8A8067",
        display: "block", marginBottom: "6px",
      }}>{label}</label>
      {children}
    </div>
  );
}
