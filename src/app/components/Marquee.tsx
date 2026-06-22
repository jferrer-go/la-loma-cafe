export function Marquee({ items = ["Small Batch", "Roasted by Hand", "Roasted to Order", "Café Cubano, Elevated", "Specialty Grade", "Strong & Sweet"] }) {
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div style={{ background: "#9A0B0B", overflow: "hidden", padding: "13px 0", display: "flex" }}>
      <div style={{ display: "flex", animation: "marquee 35s linear infinite", willChange: "transform" }}>
        {repeated.map((item, i) => (
          <span key={i} style={{
            fontFamily: "'Courier Prime', monospace",
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase",
            color: "#F4EFE3", whiteSpace: "nowrap",
            padding: "0 28px",
            borderRight: "1px solid rgba(244,239,227,0.25)",
          }}>{item}</span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}
