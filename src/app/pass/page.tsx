// @ts-nocheck
'use client';

import React, { useState } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import PassHowItWorks from "@/components/home/PassHowItWorks";
import VideoSection from "@/components/home/VideoSection";
import PricingSection from "@/components/home/PricingSection";
import StartPartnershipModal from "@/components/partnership/StartPartnershipModal";

export default function PassPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white selection:bg-blue-600 selection:text-white">
      <Header onOpenPartnershipModal={() => setIsModalOpen(true)} />
      <Hero onOpenPartnershipModal={() => setIsModalOpen(true)} />
      <Features onOpenPartnershipModal={() => setIsModalOpen(true)} />
      <PassHowItWorks />
      <VideoSection />
      <PricingSection onOpenPartnershipModal={() => setIsModalOpen(true)} />
      <Footer />

      <StartPartnershipModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}
