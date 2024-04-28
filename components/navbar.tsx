"use client";

import React from "react";
import { navbarItems } from "../utils/content";
import Button from "./ui-components/button";
import HeaderLogo from "./ui-components/header-logo";
import {
  Navbar as NavbarEl,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@nextui-org/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <>
      <NavbarEl onMenuOpenChange={setIsMenuOpen} maxWidth="xl" className="py-1">
        <NavbarContent>
          <NavbarBrand>
            <HeaderLogo />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {navbarItems.map((item, index) => {
            return (
              <NavbarItem>
                <a
                  href={item.href}
                  className="text-base text-neutral-700 hover:text-primary-orange transition-colors ease-in-out"
                  key={index}
                >
                  {item.title}
                </a>
              </NavbarItem>
            );
          })}
        </NavbarContent>
        <NavbarContent justify="end">
          {/* <Button title={"Contact"} className={""} /> */}
          <button
            className={`hidden sm:block bg-primary-orange hover:bg-orange-600 rounded-full font-medium text-white text-base px-4 py-2`}
          >
            Contact
          </button>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden text-primary-orange"
          />
        </NavbarContent>
        <NavbarMenu>
          {navbarItems.map((item, index) => {
            return (
              <NavbarMenuItem>
                <a
                  href={item.href}
                  className="text-base text-neutral-700 hover:text-primary-orange transition-colors ease-in-out"
                  key={index}
                >
                  {item.title}
                </a>
              </NavbarMenuItem>
            );
          })}
          <NavbarMenuItem>
            <Button title={"Contact"} />
          </NavbarMenuItem>
        </NavbarMenu>
      </NavbarEl>
    </>
  );
}
