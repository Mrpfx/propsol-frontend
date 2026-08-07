import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PricingSection from "@/components/home/PricingSection";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#050A24] text-white pt-20">
      <Header />
      <PricingSection />
      <Footer />
    </main>
  );
}
