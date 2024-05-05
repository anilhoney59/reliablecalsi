"use client";

import { useState, useEffect } from "react";
import { openUrl, WP_LINK } from "../../utils/content";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const FloatingButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.button
      initial={{ scale: 0 }} // Initial scale of 0
      animate={{ scale: 1 }} // Animate to scale of 1
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      className="fixed bottom-4 right-4 z-50 rounded-full bg-primary-orange px-3 py-3 font-bold text-white shadow-lg hover:bg-orange-700"
      onClick={() => openUrl(WP_LINK)}
    >
      <FaWhatsapp size={28} />
    </motion.button>
  );
};

export default FloatingButton;
