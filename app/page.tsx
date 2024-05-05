"use client";

import React, { useEffect } from "react";
import HeroSection from "../components/hero-section";
import ProjectsSlider from "../components/projects-slider";
import ServicesSection from "../components/services-section";
import AboutSection from "../components/about-section";
import CTASection from "../components/cta-section";
import Footer from "../components/footer";
import { NextSeo } from "next-seo";
import { smoothScroll } from "../utils/scroll";

export default function page() {
  useEffect(() => {
    // smoothScroll();
  }, []);

  return (
    <>
      <NextSeo
        title="Reliable Design - Arcitect, Vastu and Structural Solutions"
        description="One-stop solution to all your architectural design needs"
        canonical="https://your-domain.com/"
        themeColor="orange"
        openGraph={{
          type: "website",
          locale: "en_IE",
          url: "your-url-here",
          siteName: "Reliable Design",
        }}
      />
      <div className="">
        <HeroSection />
        <ProjectsSlider />
        <ServicesSection />
        <AboutSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
