import Nav from "../components/nav";

import FloatingButton from "../components/ui-components/floating-button";
import "../styles/globals.css";
import { inter } from "./fonts";
import { Providers } from "./providers";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reliable Design",
  description: "Add your description here",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={`relative ${inter.className}`}>
        <Providers>
          <Nav />
          <main className="app">{children}</main>
          <div className="main">
            <div className="gradient" />
          </div>
          <FloatingButton />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
