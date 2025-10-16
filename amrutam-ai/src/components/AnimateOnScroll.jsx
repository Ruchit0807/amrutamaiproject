"use client";

import { useEffect, useRef } from "react";

export default function AnimateOnScroll({ children, as: Tag = "div", className = "", threshold = 0.2 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("aos-init");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.remove("aos-init");
          el.classList.add("aos-in");
          io.unobserve(el);
        }
      });
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}



