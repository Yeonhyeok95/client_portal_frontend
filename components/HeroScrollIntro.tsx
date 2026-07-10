"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroScrollIntro({
  image,
  children,
  className = "",
}: {
  image: string;
  children: React.ReactNode;
  className?: string;
}) {
  const container = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const imageOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  // Keyframes must span the full 0–1 range: framer-motion runs these on the
  // native ScrollTimeline, where a partial range falls back to the element's
  // base style after the last keyframe.
  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 0.8, 1],
    [0, 0, 1, 1],
  );
  const heroScale = useTransform(
    scrollYProgress,
    [0, 0.6, 0.8, 1],
    [0.8, 0.8, 1, 1],
  );
  const heroPointerEvents = useTransform(scrollYProgress, (p) =>
    p > 0.6 ? "auto" : "none",
  );

  return (
    <div ref={container} className={`relative h-[200vh] ${className}`}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ scale: imageScale, opacity: imageOpacity }}
          className="absolute inset-0"
        >
          <img
            src={image}
            alt=""
            className="object-cover w-full h-full"
          />
        </motion.div>

        <motion.div
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            pointerEvents: heroPointerEvents,
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <div className="w-full">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
