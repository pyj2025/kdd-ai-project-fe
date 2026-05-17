"use client";

import { PILLARS, STEPS } from "./constants";
import PillarCard from "./PillarCard";
import StepCard from "./StepCard";

function Methodology() {
  return (
    <section
      id="methodology"
      style={{
        maxWidth: "64rem",
        margin: "0 auto",
        padding: "5rem 1.5rem",
      }}
    >
      {/* Hero headline */}
      <h1
        className="font-serif"
        style={{
          textAlign: "center",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 700,
          color: "#2e4a63",
          marginBottom: "5rem",
        }}
      >
        Turn Your &apos;What-Ifs&apos; Into Actionable Insights
      </h1>

      {/* Core Analytical Pillars */}
      <div style={{ marginBottom: "6rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: "3rem",
          }}
        >
          Core Analytical Pillars
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem",
          }}
        >
          {PILLARS.map(pillar => (
            <PillarCard key={pillar.title} {...pillar} />
          ))}
        </div>
      </div>

      {/* How If-Vest Works */}
      <div>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: "2rem",
          }}
        >
          How If-Vest Works
        </h2>

        {/* Step 01 + 02 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
            marginBottom: "1.25rem",
          }}
        >
          {STEPS.slice(0, 2).map(step => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>

        {/* Step 03 — left half only */}
        <div style={{ maxWidth: "50%" }}>
          <StepCard {...STEPS[2]} />
        </div>
      </div>
    </section>
  );
}

export default Methodology;
