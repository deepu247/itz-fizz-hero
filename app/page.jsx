"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const WORDS = ["WELCOME", "ITZ", "FIZZ"];

const STATS = [
  { value: "98%", label: "Client satisfaction" },
  { value: "240+", label: "Brands launched" },
  { value: "3.2x", label: "Average growth" },
];

const SCROLL_CONFIG = {
  desktop: { screens: 1.8, x: 62, y: -8, scale: 1.25, rotation: 14, glowX: 45, glowY: -25 },
  tablet: { screens: 1.6, x: 46, y: -6, scale: 1.15, rotation: 12, glowX: 35, glowY: -20 },
  mobile: { screens: 1.4, x: 34, y: -10, scale: 1.1, rotation: 10, glowX: 25, glowY: -15 },
};

export default function Page() {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const statsRef = useRef(null);
  const visualRef = useRef(null);
  const floatRef = useRef(null);
  const glowRef = useRef(null);
  const cueRef = useRef(null);

  useIsoLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;

    ScrollTrigger.config({ ignoreMobileResize: true });

    let mm;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(hero);
      const letters = q(".hero-letter");
      const stats = q(".hero-stat");
      const introVisual = q(".hero-intro-visual");
      const cueInner = q(".hero-cue-inner");

      mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          tablet: "(min-width: 640px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 639px) and (prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (mq) => {
          const { desktop, tablet, reduce } = mq.conditions;

          if (reduce) {
            gsap.set([...letters, ...stats, ...introVisual, ...cueInner], { opacity: 1 });
            return undefined;
          }

          const cfg = desktop ? SCROLL_CONFIG.desktop : tablet ? SCROLL_CONFIG.tablet : SCROLL_CONFIG.mobile;

          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
          intro
            .fromTo(
              letters,
              { y: 70, opacity: 0 },
              { y: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: "expo.out" },
              0.1
            )
            .fromTo(
              introVisual,
              { opacity: 0, scale: 0.7, rotation: -10 },
              { opacity: 1, scale: 1, rotation: 0, duration: 1.8, ease: "expo.out" },
              0.2
            )
            .fromTo(
              stats,
              { y: 36, opacity: 0 },
              { y: 0, opacity: 1, duration: 1, stagger: 0.18 },
              0.8
            )
            .fromTo(cueInner, { opacity: 0 }, { opacity: 1, duration: 1.2 }, 1.6);

          gsap.to(floatRef.current, {
            yPercent: -2.5,
            rotation: 1.2,
            duration: 3.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });

          const scrollTl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: () => `+=${Math.round(window.innerHeight * cfg.screens)}`,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          scrollTl
            .to(headlineRef.current, { yPercent: -70, scale: 0.92, opacity: 0, duration: 0.6 }, 0)
            .to(statsRef.current, { yPercent: -120, opacity: 0, duration: 0.45 }, 0)
            .to(cueRef.current, { opacity: 0, duration: 0.15 }, 0)
            .to(
              visualRef.current,
              {
                xPercent: cfg.x,
                yPercent: cfg.y,
                scale: cfg.scale,
                rotation: cfg.rotation,
                duration: 1,
                ease: "power1.inOut",
              },
              0
            )
            .to(
              glowRef.current,
              { xPercent: cfg.glowX, yPercent: cfg.glowY, scale: 1.3, opacity: 0, duration: 1 },
              0
            );

          return undefined;
        }
      );
    }, hero);

    return () => {
      if (mm) mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <main>
      <section
        ref={heroRef}
        aria-labelledby="hero-title"
        className="relative isolate min-h-screen w-full overflow-hidden bg-[#05060a] text-white"
      >
        <div aria-hidden="true" className="hero-bg pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div ref={glowRef} className="hero-glow h-[70vmin] w-[70vmin] rounded-full" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#05060a] to-transparent"
        />

        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center pt-[6vh]">
          <div
            ref={visualRef}
            className="relative aspect-square w-[min(88vw,26rem)] will-change-transform sm:w-[min(70vw,36rem)] lg:w-[min(62vh,46rem)]"
          >
            <span aria-hidden="true" className="absolute -inset-[8%] rounded-full border border-white/10" />
            <span aria-hidden="true" className="absolute -inset-[22%] rounded-full border border-white/5" />
            <div ref={floatRef} className="h-full w-full will-change-transform">
              <div className="hero-intro-visual h-full w-full opacity-0 will-change-transform">
                <Image
                  src="/images/hero-object.png"
                  alt="Glowing three-dimensional sphere floating above the page"
                  width={1200}
                  height={1200}
                  priority
                  sizes="(min-width: 1024px) 46rem, (min-width: 640px) 36rem, 88vw"
                  className="h-full w-full object-contain drop-shadow-[0_30px_60px_rgba(99,102,241,0.35)]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-between px-5 pb-28 pt-20 text-center sm:px-8 sm:pb-32 sm:pt-24">
          <div ref={headlineRef} className="will-change-transform">
            <h1
              id="hero-title"
              aria-label="Welcome Itz Fizz"
              className="flex flex-wrap justify-center gap-x-[0.5em] text-[clamp(2.25rem,11vw,3.5rem)] font-extrabold uppercase leading-[1.05] tracking-[0.14em] sm:text-[clamp(3rem,9vw,5.5rem)] lg:text-[clamp(4rem,6.5vw,7.5rem)]"
            >
              {WORDS.map((word) => (
                <span key={word} aria-hidden="true" className="inline-flex">
                  {word.split("").map((char, i) => (
                    <span
                      key={`${word}-${i}`}
                      className="hero-letter inline-block bg-gradient-to-b from-white to-white/55 bg-clip-text text-transparent opacity-0 will-change-transform"
                    >
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
          </div>

          <div ref={statsRef} className="w-full will-change-transform">
            <ul className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-8">
              {STATS.map((stat) => (
                <li
                  key={stat.label}
                  className="hero-stat flex items-baseline justify-center gap-3 opacity-0 sm:flex-col sm:items-center sm:gap-1"
                >
                  <strong className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {stat.value}
                  </strong>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/60 sm:text-sm">{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div ref={cueRef} className="absolute inset-x-0 bottom-6 z-20 flex justify-center">
          <div className="hero-cue-inner flex flex-col items-center gap-3 opacity-0">
            <span className="text-[0.65rem] uppercase tracking-[0.35em] text-white/60">Scroll to explore</span>
            <span aria-hidden="true" className="hero-cue-line block h-10 w-px bg-gradient-to-b from-white/70 to-transparent" />
          </div>
        </div>
      </section>

      <section className="relative z-30 flex min-h-screen items-center bg-neutral-100 px-6 py-28 text-neutral-950 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="max-w-4xl text-[clamp(2.5rem,8vw,7rem)] font-extrabold leading-[0.95] tracking-tight">
            Motion that follows every scroll.
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-600">
            Every movement in the hero above is tied to your scroll position. Scroll back up and the scene rewinds,
            frame for frame.
          </p>
        </div>
      </section>
    </main>
  );
}
