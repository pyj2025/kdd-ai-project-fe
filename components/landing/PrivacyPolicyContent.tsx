import { PRIVACY_POLICY_CONTENT } from "./constants";

function PrivacyPolicyContent() {
  return (
    <div style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "#374151" }}>
      <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "1.5rem" }}>
        Last updated: January 1, 2026
      </p>

      {PRIVACY_POLICY_CONTENT.map(({ title, body }) => (
        <div key={title} style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontWeight: 600, marginBottom: "0.4rem", color: "#1e293b" }}>{title}</h3>
          <p>{body}</p>
        </div>
      ))}
    </div>
  );
}

export default PrivacyPolicyContent;
