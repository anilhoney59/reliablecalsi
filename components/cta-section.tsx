"use client";

import React from "react";
import Button from "./ui-components/button";
import { openUrl, WP_LINK } from "../utils/content";

type Props = {};

export default function CTASection({}: Props) {
  return (
    <>
      <div className="mt-20 flex flex-col items-center justify-center gap-5 bg-theme py-10 lg:py-20">
        <span className="text-center text-3xl font-semibold text-white lg:text-6xl">
          Get in touch <br /> with enginner now
        </span>
        <button
          onClick={() => openUrl(WP_LINK)}
          className="rounded-full bg-white px-5 py-2 font-medium text-theme lg:px-5 lg:py-4 lg:text-xl"
        >
          Contact to Engineer
        </button>
      </div>
    </>
  );
}
