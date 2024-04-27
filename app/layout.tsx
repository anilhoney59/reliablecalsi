import Navbar from "../components/navbar";
import "../styles/globals.css";
import { inter } from "./fonts";

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={`relative ${inter.className}`}>
        <Navbar />
        <main className="app">{children}</main>
        <div className="main">
          <div className="gradient" />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
