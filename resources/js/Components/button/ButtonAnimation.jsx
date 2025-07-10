import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useSprings,
  animated, // eslint-disable-line no-unused-vars
  config as springConfig,
} from "@react-spring/web";

export default function ButtonAnimation({
  className = "",
  label = "",
  hoverLabel = "",
  href = "/",
}) {
  const [isHovered, setIsHovered] = useState(false);
  const chars = hoverLabel.split("");
  const leaveTimeout = useRef(null);

  const overlayFadeDuration = 300;
  const letterStagger = 20;
  const letterDuration = 120;

  const onMouseEnter = () => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    leaveTimeout.current = window.setTimeout(() => {
      setIsHovered(false);
    }, 80);
  };

  useEffect(() => {
    return () => {
      if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    };
  }, []);

  const springs = useSprings(
    chars.length,
    chars.map((_, i) => ({
      from: { opacity: 0, transform: "translate3d(0,10px,0)" },
      to: {
        opacity: isHovered ? 1 : 0,
        transform: isHovered ? "translate3d(0,0px,0)" : "translate3d(0,10px,0)",
      },
      delay: isHovered
        ? overlayFadeDuration + i * letterStagger
        : (chars.length - 1 - i) * letterStagger,
      config: isHovered
        ? { ...springConfig.gentle, duration: letterDuration }
        : { ...springConfig.stiff, duration: letterDuration },
    }))
  );

  const handleClick = (e) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <Link
      to={href}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center py-3 px-6 rounded-full overflow-hidden bg-white ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
        style={{ opacity: isHovered ? 0 : 1 }}
      >
        <span className="text-teal-500 text-sm font-semibold">{label}</span>
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-br from-teal-200 via-teal-700 to-teal-400 z-10 flex items-center justify-center cursor-pointer"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: `opacity ${overlayFadeDuration}ms ease-in-out`,
        }}
      >
        {springs.map((style, idx) => (
          <animated.span
            key={idx}
            className="font-semibold text-white text-sm"
            style={{
              ...style,
              display: "inline-block",
              willChange: "transform, opacity",
            }}
          >
            {chars[idx] === " " ? "\u00A0" : chars[idx]}
          </animated.span>
        ))}
      </div>

      <span className="invisible text-sm font-semibold">{hoverLabel}</span>
    </Link>
  );
}
