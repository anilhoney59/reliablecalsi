import Image from "next/image";
import React from "react";
import Button from "./ui-components/button";

type Props = {};

export default function HeroSection({}: Props) {
  return (
    <>
      <section className="layout-container h-[80vh] flex items-center justify-between">
        {/* Left - content */}
        <div className="">
          <h1 className="text-6xl font-bold leading-[1.2]">
            Design your home <br /> from{" "}
            <span className="text-primary-orange">Professionals</span>
          </h1>
          <p className="text-xl font-medium text-neutral-600 mb-5">
            One-stop solution to all your architectural design needs
          </p>
          <Button title="Contact to Engineer" size="lg" />
        </div>
        {/* Right - hero image */}
        <div className="-mr-20">
          <Image
            className="relative"
            src={"/hero.svg"}
            width={"550"}
            height={"550"}
            alt="Hero Image"
          />
        </div>
      </section>
    </>
  );
}
