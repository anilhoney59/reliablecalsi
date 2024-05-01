"use client";

import React from "react";
import { navbarItems, openUrl, WP_LINK } from "../utils/content";
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
import { RxHamburgerMenu } from "react-icons/rx";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <>
      <NavbarEl onMenuOpenChange={setIsMenuOpen} maxWidth="xl" className="py-1">
        <NavbarContent>
          <NavbarBrand>
            <HeaderLogo />
          </NavbarBrand>
        </NavbarContent>

        {/* <NavbarContent
          className="hidden gap-4 sm:flex"
          justify="center"
        ></NavbarContent> */}
        <NavbarContent justify="end">
          {/* <Button title={"Contact"} className={""} /> */}
          <div className="hidden gap-4 sm:flex">
            {navbarItems.map((item, index) => {
              return (
                <NavbarItem>
                  <a
                    href={item.href}
                    className="text-base text-neutral-700 transition-colors ease-in-out hover:text-primary-orange"
                    key={index}
                  >
                    {item.title}
                  </a>
                </NavbarItem>
              );
            })}
          </div>
          <button
            onClick={() => openUrl(WP_LINK)}
            className={`hidden rounded-full bg-primary-orange px-4 py-2 text-base font-medium text-white hover:bg-orange-600 sm:block`}
          >
            Contact
          </button>
          <NavbarMenuToggle
            icon={<RxHamburgerMenu size={28} />}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="text-primary-orange sm:hidden"
          />
        </NavbarContent>
        <NavbarMenu>
          {navbarItems.map((item, index) => {
            return (
              <NavbarMenuItem>
                <a
                  onClick={() => setIsMenuOpen(false)}
                  href={item.href}
                  className="text-base text-neutral-700 transition-colors ease-in-out hover:text-primary-orange"
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
