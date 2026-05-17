"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import PrivacyPolicyContent from "../landing/PrivacyPolicyContent";
import CookiePolicyContent from "../landing/CookiePolicyContent";
import ManageCookiesContent from "../landing/ManageCookiesContent";
import { ModalKey } from "./types";

const modals: Record<ModalKey, { title: string; content: React.ReactNode }> = {
  privacy: { title: "Privacy Policy", content: <PrivacyPolicyContent /> },
  cookies: { title: "Cookie Policy", content: <CookiePolicyContent /> },
  manage: { title: "Manage My Cookies", content: <ManageCookiesContent /> },
};

const links: { label: string; key: ModalKey }[] = [
  { label: "Privacy Policy", key: "privacy" },
  { label: "Cookie Policy", key: "cookies" },
  { label: "Manage my cookies", key: "manage" },
];

function Footer() {
  const [open, setOpen] = useState<ModalKey | null>(null);

  return (
    <>
      <footer
        style={{
          width: "100%",
          backgroundColor: "#3a3a3a",
          borderTop: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "1.25rem 2rem",
          }}
        >
          <Separator />
          {/* Brand */}
          <div style={{ marginBottom: "1rem", paddingTop: "1rem" }}>
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.05em",
              }}
            >
              IF-VEST
            </span>
          </div>

          {/* Bottom row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            {/* Links */}
            <nav style={{ display: "flex", alignItems: "center" }}>
              {links.map(({ label, key }, index) => (
                <span key={key} style={{ display: "flex", alignItems: "center" }}>
                  <button
                    onClick={() => setOpen(key)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      color: "rgba(200,200,200,0.75)",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(200,200,200,0.75)")}
                  >
                    {label}
                  </button>
                  {index < links.length - 1 && (
                    <span
                      style={{
                        margin: "0 0.6rem",
                        color: "rgba(200,200,200,0.4)",
                        fontSize: "0.8rem",
                      }}
                    >
                      |
                    </span>
                  )}
                </span>
              ))}
            </nav>

            {/* Copyright */}
            <span style={{ fontSize: "0.8rem", color: "rgba(200,200,200,0.6)" }}>
              © 2026 IF-VEST. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <Dialog open={open !== null} onOpenChange={v => !v && setOpen(null)}>
        <DialogContent style={{ maxWidth: "520px", maxHeight: "80vh", overflowY: "auto" }}>
          <DialogHeader>
            <DialogTitle>{open ? modals[open].title : ""}</DialogTitle>
          </DialogHeader>
          {open && modals[open].content}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Footer;
