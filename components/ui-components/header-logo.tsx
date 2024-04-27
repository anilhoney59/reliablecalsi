import Link from "next/link";
import React from "react";
import { playfair } from "../../app/fonts";
import { SITE_NAME, TAGLINE } from "../../utils/content";

export default function HeaderLogo() {
  return (
    <Link href="/">
      <div className="flex flex-col">
        <h1
          className={` ${playfair.className} font-bold text-2xl text-primary-orange`}
        >
          {SITE_NAME}
        </h1>
        <span className="text-sm tracking-tight">{TAGLINE}</span>
      </div>
    </Link>
  );
}
