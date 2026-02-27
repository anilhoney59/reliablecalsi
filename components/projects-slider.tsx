"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import { projectsItem } from "../utils/content";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function ProjectsSlider() {
  return (
    <>
      <div className="layout-container mt-14" id="projects">
        <h2 className="text-3xl font-semibold text-theme md:mb-10 md:text-5xl">
          Some of our <br /> selected projects
        </h2>
      </div>
      <div className="layout-container">
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          modules={[Navigation, EffectFade]}
          navigation
          effect="fade"
          loop={false}
        >
          {projectsItem.map((item, index) => (
            <SwiperSlide key={index}>
              {/* Fixed-height frame — every slide is the same box */}
              <div className="relative w-full h-[300px] sm:h-[480px] md:h-[560px] rounded-xl overflow-hidden">

                {/* Blurred background — fills any letterbox/pillarbox gaps */}
                <img
                  src={item.img}
                  alt=""
                  aria-hidden="true"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover scale-110"
                  style={{ filter: "blur(18px) brightness(0.55)" }}
                />

                {/* Main image — contained inside the frame, never cropped */}
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                  <img
                    src={item.img}
                    alt={item.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "low"}
                    decoding={index === 0 ? "sync" : "async"}
                    className="max-w-full max-h-full object-contain"
                    style={{ maxHeight: "inherit" }}
                  />
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
