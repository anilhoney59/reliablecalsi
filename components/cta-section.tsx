import React from "react";
import Button from "./ui-components/button";

type Props = {};

export default function CTASection({}: Props) {
  return (
    <>
      <div className="bg-primary-orange py-20 flex flex-col gap-5 items-center justify-center">
        <span className="text-6xl font-semibold text-center text-white">
          Get in touch <br /> with enginner now
        </span>
        <button className="text-xl bg-white rounded-full py-4 px-5 font-medium text-primary-orange">
          Contact to Engineer
        </button>
      </div>
    </>
  );
}
