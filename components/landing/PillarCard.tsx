import { PillarType } from "./types";

function PillarCard({ title, description }: PillarType) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* accent line */}
      <div
        style={{
          height: "2px",
          width: "96px",
          backgroundColor: "#a8bccf",
          flexShrink: 0,
        }}
      />
      <h3 className="font-serif text-xl" style={{ color: "#3d5370", margin: 0 }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "#6b7280", margin: 0 }}>
        {description}
      </p>
    </div>
  );
}

export default PillarCard;
