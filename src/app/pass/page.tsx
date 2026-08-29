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
import StartPassModal from "@/components/pass/StartPassModal";

export default function PassPage() {
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [passModalParams, setPassModalParams] = useState(null);

  const handleOpenPassModal = (params?: any) => {
    setPassModalParams(params || null);
    setIsPassModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-white selection:bg-blue-600 selection:text-white">
      <Header />
      <Hero onOpenPassModal={handleOpenPassModal} />
      <Features onOpenPassModal={handleOpenPassModal} />
      <PassHowItWorks />
      <VideoSection />
      <PricingSection onOpenPassModal={handleOpenPassModal} />
      <Footer />
      <StartPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        initialPlan={passModalParams}
      />
    </main>
  );
}
