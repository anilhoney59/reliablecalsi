"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  EffectFade,
  Scrollbar,
  A11y,
  Pagination,
} from "swiper/modules";
import { projectsItem } from "../utils/content";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function ProjectsSlider() {
  return (
    <>
      <div className="layout-container mt-14" id="projects">
        {/* text-5xl font-semibold text-primary-orange */}
        <h2 className="text-3xl font-semibold text-primary-orange md:mb-10 md:text-5xl">
          Some of our <br /> selected projects
        </h2>
      </div>
      {/* h-[80vh] w-full bg-red-200 */}
      <div className="layout-container">
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          modules={[Navigation, EffectFade, Pagination]}
          // Uncomment below line to enable pagination
          // pagination={{
          //   dynamicBullets: true
          // }}
          navigation
          effect={"fade"}
          loop={true}
        >
          {projectsItem.map((item, index) => {
            return (
              <>
                <SwiperSlide key={index}>
                  <div className="relative flex h-fit w-full items-center justify-center rounded-md sm:h-[80vh] sm:w-full">
                    <div className="absolute bottom-5 left-0 z-10 w-full bg-neutral-600/20 px-5 text-lg font-medium text-white shadow-xl backdrop-blur-sm">
                      {item.title}
                    </div>
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill={true}
                      loading="lazy"
                      className="rounded-xl"
                    />
                  </div>
                </SwiperSlide>
              </>
            );
          })}
        </Swiper>
      </div>
    </>
  );
}
