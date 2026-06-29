import React from "react";
import { motion } from "framer-motion";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}) {
  const dirMap = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
  };
  const offset = dirMap[direction] || dirMap.up;

  return (
    <motion.div
      initial={{ opacity: 0, ...offset, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}