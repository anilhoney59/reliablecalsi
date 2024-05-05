"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeaderLogo from "./ui-components/header-logo";
import { navbarItems, openUrl, WP_LINK } from "../utils/content";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 z-10 w-full bg-white/30 backdrop-blur-lg backdrop-filter">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <HeaderLogo />
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navbarItems.map((item, index) => {
                return (
                  <a
                    href={item.href}
                    className="text-base text-neutral-700 transition-colors ease-in-out hover:text-primary-orange"
                    key={index}
                  >
                    {item.title}
                  </a>
                );
              })}
              <button
                onClick={() => openUrl(WP_LINK)}
                className={`hidden rounded-full bg-primary-orange px-4 py-2 text-base font-medium text-white hover:bg-orange-600 sm:block`}
              >
                Contact
              </button>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-primary-orange focus:outline-none"
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute h-screen w-full overflow-hidden bg-white/90 backdrop-blur-xl backdrop-filter md:hidden"
          >
            <div className="flex h-screen flex-col space-y-5 px-2 pb-3 pt-6 sm:px-3">
              {navbarItems.map((item, index) => {
                return (
                  <a
                    href={item.href}
                    className="text-3xl font-medium text-neutral-700 transition-colors ease-in-out hover:text-primary-orange"
                    key={index}
                    onClick={closeMenu}
                  >
                    {item.title}
                  </a>
                );
              })}
              <button
                onClick={() => openUrl(WP_LINK)}
                className={`w-fit rounded-full bg-primary-orange px-4 py-2 text-base font-medium text-white hover:bg-orange-600`}
              >
                Contact
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Nav;
