import React from "react";
import { aboutDescription } from "../utils/content";
import Image from "next/image";

type Props = {};

export default function AboutSection({}: Props) {
  return (
    <>
      <div className="layout-container flex justify-between py-20 items-center">
        {/* Left side */}
        <div className="flex-1">
          <h2 className="text-5xl font-semibold text-primary-orange my-5">
            A bit about me
          </h2>
          <p className="text-lg font-medium text-neutral-600">
            {aboutDescription}
          </p>
        </div>
        {/* Right side */}
        <div className="w-1/2 flex h-fit justify-end">
          <Image src={"/profile.png"} width={500} height={500} alt="Profile" />
        </div>
      </div>
    </>
  );
}
