import Image from "next/image";
import React from "react";
import { ServicesProps } from "../../utils/types";

export default function ServiceCard({
  imgSrc,
  title,
  description,
  width,
  height,
}: ServicesProps) {
  return (
    <>
      <div className="min-h-[400px] max-h-full bg-[#F8F8F8] px-5 rounded-lg border border-neutral-300 py-5 flex flex-col gap-3 justify-center shadow-lg">
        {/* Image */}
        <div>
          <Image src={imgSrc} width={width} height={height} alt={title} />
        </div>
        {/* Name */}
        <div className="flex flex-col gap-3">
          <div className="">
            <span className="text-2xl font-medium text-theme">
              {title}
            </span>
          </div>
          {/* Description */}
          <div className="">
            <p className="text-base font-medium text-neutral-600">
              {description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
