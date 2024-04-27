import React from "react";
import HeroSection from "../components/hero-section";
import ProjectsSlider from "../components/projects-slider";
import ServicesSection from "../components/services-section";
import AboutSection from "../components/about-section";
import CTASection from "../components/cta-section";
import Footer from "../components/footer";

export default function page() {
  return (
    <>
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
