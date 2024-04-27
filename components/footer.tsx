import React from "react";
import HeaderLogo from "./ui-components/header-logo";
import { navbarItems, socialsLinks } from "../utils/content";
import Link from "next/link";

type Props = {};

export default function Footer({}: Props) {
  return (
    <>
      <div className="layout-container my-20 flex justify-between">
        {/* Left */}
        <HeaderLogo />
        {/* Center */}
        <div className="w-fit flex gap-5 ">
          {navbarItems.map((item, index) => {
            return (
              <>
                <Link
                  href={item.href}
                  key={index}
                  className="font-medium hover:text-primary-orange h-fit w-fit"
                >
                  {item.title}
                </Link>
              </>
            );
          })}
        </div>
        {/* Socials */}
        <div className="flex gap-5">
          {socialsLinks.map((item, index) => {
            return (
              <div className="text-2xl text-primary-orange" key={index}>
                {item.icon}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
