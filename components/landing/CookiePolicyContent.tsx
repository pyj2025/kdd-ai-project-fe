function CookiePolicyContent() {
  return (
    <div style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "#374151" }}>
      <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "1.5rem" }}>
        Last updated: January 1, 2026
      </p>

      <div style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ fontWeight: 600, marginBottom: "0.4rem", color: "#1e293b" }}>
          What Are Cookies
        </h3>
        <p>
          Cookies are small text files stored on your device when you visit our site. They help us
          remember your preferences and understand how you use the platform.
        </p>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ fontWeight: 600, marginBottom: "0.4rem", color: "#1e293b" }}>
          Types of Cookies We Use
        </h3>
        <ul
          style={{
            paddingLeft: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <li>
            <strong>Essential:</strong> Required for the site to function. Cannot be disabled.
          </li>
          <li>
            <strong>Analytics:</strong> Help us understand how visitors interact with the platform.
          </li>
          <li>
            <strong>Marketing:</strong> Used to deliver relevant content and measure campaign
            performance.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CookiePolicyContent;
