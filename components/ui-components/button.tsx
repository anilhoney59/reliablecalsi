"use client";

import React from "react";
import { openUrl, WP_LINK } from "../../utils/content";

export default function Button({
  title,
  size = "base",
  className,
}: {
  title: string;
  size?: "base" | "md" | "lg";
  className?: any;
}) {
  let buttonSizeClass = "";

  if (size === "base") buttonSizeClass = `text-base px-4 py-2`;
  if (size === "md") buttonSizeClass = `text-lg px-4 py-3`;
  if (size === "lg") buttonSizeClass = `text-xl px-5 py-3`;

  return (
    <>
      <button
        onClick={() => openUrl(WP_LINK)}
        className={`rounded-full bg-theme hover-bg-theme font-medium text-white ${buttonSizeClass} ${className}`}
      >
        {title}
      </button>
    </>
  );
}
