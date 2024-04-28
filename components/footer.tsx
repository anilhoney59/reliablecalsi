"use client";

import React from "react";
import HeaderLogo from "./ui-components/header-logo";
import { navbarItems, socialsLinks } from "../utils/content";
import Link from "next/link";

type Props = {};

export default function Footer({}: Props) {
  const year = new Date().getFullYear();
  return (
    <>
      <div className="layout-container flex flex-col items-center gap-10 py-10 md:flex-row md:justify-between">
        {/* Left */}
        <div className="flex flex-col items-center">
          <HeaderLogo />
          <span className="text-xs text-neutral-500">
            © {year} - Reliable Design | All rights reserved
          </span>
        </div>
        {/* Center */}
        <div className="flex w-fit gap-5 ">
          {navbarItems.map((item, index) => {
            return (
              <>
                <Link
                  href={item.href}
                  key={index}
                  className="h-fit w-fit font-medium hover:text-primary-orange"
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
