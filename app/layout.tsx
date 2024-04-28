import Navbar from "../components/navbar";
import "../styles/globals.css";
import { inter } from "./fonts";
import { Providers } from "./providers";

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
