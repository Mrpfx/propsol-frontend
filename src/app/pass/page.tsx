// @ts-nocheck
'use client';

import React from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import PassHowItWorks from "@/components/home/PassHowItWorks";
import VideoSection from "@/components/home/VideoSection";
import PricingSection from "@/components/home/PricingSection";

export default function PassPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-blue-600 selection:text-white">
      <Header />
      <Hero ctaHref="/register/wizard" />
      <Features ctaHref="/register/wizard" />
      <PassHowItWorks />
      <VideoSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
