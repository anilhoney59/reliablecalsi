"use client";

import React from "react";
import dynamic from "next/dynamic";
import HeroSection from "../components/hero-section";
import ServicesSection from "../components/services-section";
import AboutSection from "../components/about-section";
import CTASection from "../components/cta-section";
import Footer from "../components/footer";

// Dynamically import the slider — defers Swiper's JS bundle until after
// the hero is interactive, so it does not block initial page load.
const ProjectsSlider = dynamic(() => import("../components/projects-slider"), {
  ssr: false,
  loading: () => (
    <div
      className="layout-container mt-14"
      style={{ height: "80vh", background: "#f3f4f6", borderRadius: 12 }}
    />
  ),
});

export default function page() {
  return (
    <div className="">
      <HeroSection />
      <div id="projects">
        <ProjectsSlider />
      </div>
      <ServicesSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
}
