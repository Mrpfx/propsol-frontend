// @ts-nocheck
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import PassHowItWorks from "@/components/home/PassHowItWorks";
import VideoSection from "@/components/home/VideoSection";
import PricingSection from "@/components/home/PricingSection";
import StartPassModal from "@/components/pass/StartPassModal";

function PassContent() {
  const searchParams = useSearchParams();
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [passModalParams, setPassModalParams] = useState(null);

  useEffect(() => {
    if (searchParams.get('openPassModal') === 'true' || searchParams.get('openModal') === 'true') {
      setIsPassModalOpen(true);
    }
  }, [searchParams]);

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

export default function PassPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <PassContent />
    </Suspense>
  );
}
