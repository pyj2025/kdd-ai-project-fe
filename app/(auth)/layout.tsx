function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundColor: "#f0f0ed",
        backgroundImage: `
          linear-gradient(rgba(13, 31, 53, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(13, 31, 53, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,255,255,0.7) 0%, transparent 100%)",
        }}
      />
      <div className="w-full max-w-md relative z-10">{children}</div>
    </div>
  );
}

export default AuthLayout;
