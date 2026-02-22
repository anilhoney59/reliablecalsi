import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Construction Cost Calculator | Reliable Design",
  description:
    "Estimate your home construction cost instantly. Enter your buildup area and select Basic, Standard, or Luxury to get a detailed cost breakdown.",
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
