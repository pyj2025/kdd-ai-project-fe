"use client";

import { useState } from "react";

function ManageCookiesContent() {
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    localStorage.setItem("cookie-prefs", JSON.stringify({ essential: true, ...prefs }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const rows = [
    {
      key: "essential" as const,
      label: "Essential Cookies",
      desc: "Required for authentication and core functionality.",
      locked: true,
      value: true,
    },
    {
      key: "analytics" as const,
      label: "Analytics Cookies",
      desc: "Help us improve the product by tracking usage patterns.",
      locked: false,
      value: prefs.analytics,
    },
    {
      key: "marketing" as const,
      label: "Marketing Cookies",
      desc: "Personalize ads and measure campaign effectiveness.",
      locked: false,
      value: prefs.marketing,
    },
  ];

  return (
    <div>
      {rows.map(({ key, label, desc, locked, value }) => (
        <div
          key={key}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "1rem 0",
            borderBottom: "1px solid #f1f5f9",
            gap: "1rem",
          }}
        >
          <div>
            <p
              style={{
                fontWeight: 600,
                fontSize: "0.875rem",
                marginBottom: "0.2rem",
                color: "#1e293b",
              }}
            >
              {label}
            </p>
            <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>{desc}</p>
          </div>
          <button
            disabled={locked}
            onClick={() => !locked && toggle(key as keyof typeof prefs)}
            style={{
              flexShrink: 0,
              width: "44px",
              height: "24px",
              borderRadius: "9999px",
              border: "none",
              cursor: locked ? "not-allowed" : "pointer",
              backgroundColor: value ? "#2e4a63" : "#cbd5e1",
              position: "relative",
              transition: "background-color 0.2s",
              opacity: locked ? 0.5 : 1,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "3px",
                left: value ? "23px" : "3px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                transition: "left 0.2s",
              }}
            />
          </button>
        </div>
      ))}

      <button
        onClick={handleSave}
        style={{
          marginTop: "1.25rem",
          padding: "0.6rem 1.5rem",
          backgroundColor: "#2e4a63",
          color: "#fff",
          border: "none",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {saved ? "Saved ✓" : "Save Preferences"}
      </button>
    </div>
  );
}

export default ManageCookiesContent;
