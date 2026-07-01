import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustPillars from "@/components/landing/TrustPillars";
import AboutSection from "@/components/landing/AboutSection";
import IndustriesSection from "@/components/landing/IndustriesSection";
import ProcessSection from "@/components/landing/ProcessSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import RegionsSection from "@/components/landing/RegionsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";
import ScrollToTopButton from "@/components/landing/ScrollToTopButton";
import FloatingAnnouncementButton from "@/components/landing/FloatingAnnouncementButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <TrustPillars />
      <AboutSection />
      <IndustriesSection />
      <ProcessSection />
      <WhyChooseUs />
      <RegionsSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <FloatingAnnouncementButton />
      <ScrollToTopButton />
    </div>
  );
}


