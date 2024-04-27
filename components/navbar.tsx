import React from "react";
import { navbarItems } from "../utils/content";
import Button from "./ui-components/button";
import HeaderLogo from "./ui-components/header-logo";

export default function Navbar() {
  return (
    <header className="layout-container py-5 flex items-center justify-between">
      {/* Logo/Site Name */}
      <HeaderLogo />

      {/* Navbar */}
      <nav className="flex gap-4 items-center">
        {navbarItems.map((item, index) => {
          return (
            <a
              href={item.href}
              className="text-base text-neutral-700 hover:text-primary-orange transition-colors ease-in-out"
              key={index}
            >
              {item.title}
            </a>
          );
        })}
        <Button title={"Contact"} />
      </nav>
    </header>
  );
}
