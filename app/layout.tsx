import { NextSeo } from "next-seo";
import Navbar from "../components/navbar";
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
          <Navbar />
          <main className="app">{children}</main>
          <div className="main">
            <div className="gradient" />
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
