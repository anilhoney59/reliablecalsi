import Image from "next/image";
import React from "react";
import Button from "./ui-components/button";

type Props = {};

export default function HeroSection({}: Props) {
  return (
    <>
      {/* text-4xl text-center md:text-left md:text-6xl font-bold leading-[1.2] */}
      <section className="layout-container flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between">
        <div className="">
          <h1 className="mt-3 text-center text-4xl font-semibold lg:text-left lg:text-6xl">
            Design your home <br /> from{" "}
            <span className="text-primary-orange">Professionals</span>
          </h1>
          <p className="mb-5 text-center text-sm font-medium text-neutral-600 md:text-xl">
            One-stop solution to all your architectural design needs
          </p>
          <div className="flex w-full items-center justify-center md:justify-start">
            <Button title="Contact to Engineer" size="lg" />
          </div>
        </div>

        <div className="relative">
          <Image
            className="b"
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
