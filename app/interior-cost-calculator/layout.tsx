import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interior Cost Calculator 2026 | Reliable Design",
  description:
    "Estimate your home interior cost instantly. Choose Basic, Standard, or Luxury interior and get a detailed cost breakdown for materials, labour and design.",
};

export default function InteriorCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
