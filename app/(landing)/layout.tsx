import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer"; // 푸터 임포트

function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default LandingLayout;
