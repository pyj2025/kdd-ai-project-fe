import { StepType } from "./types";

function StepCard({ number, title, quote }: StepType) {
  return (
    <div
      style={{
        backgroundColor: "#3d536b",
        borderRadius: "1rem",
        padding: "2rem",
        color: "#ffffff",
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(203,213,225,0.7)",
          marginBottom: "0.75rem",
        }}
      >
        Step {number}
      </p>
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          lineHeight: 1.3,
          color: "#ffffff",
          marginBottom: "1.25rem",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "0.875rem",
          fontStyle: "italic",
          color: "rgba(203,213,225,0.6)",
          margin: 0,
        }}
      >
        {quote}
      </p>
    </div>
  );
}

export default StepCard;
