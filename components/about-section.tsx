import React from "react";
import { aboutDescription } from "../utils/content";
import Image from "next/image";

type Props = {};

export default function AboutSection({}: Props) {
  return (
    <>
      <div
        className="layout-container flex flex-col-reverse lg:mt-20 lg:flex-row "
        id="about"
      >
        {/* Left side */}
        <div className="flex-1">
          <h2 className="mb-5 text-3xl font-semibold text-primary-orange md:mb-10 md:text-5xl">
            A bit about me
          </h2>
          <p className="text-lg font-medium text-neutral-600">
            {aboutDescription}
          </p>
        </div>
        {/* Right side */}

        <div className="flex h-fit lg:w-1/2 lg:justify-end">
          <Image src={"/profile.png"} width={500} height={500} alt="Profile" />
        </div>
      </div>
    </>
  );
}
