"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Pause, Play } from "lucide-react";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Loading from "@/components/Loading";
import AboutMe from "./about/page";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const data = [
  {
    id: 1,
    title: "Blog",
    linkText: "Read my latest insights.",
    description: "Read my latest insights on web development.",
    link: "/blog",
    actionLabel: "Read More",
    image:
      "https://res.cloudinary.com/dlcwqj2t2/image/upload/v1741129836/jkcd9j7njrb6aylgfmnp.jpg",
  },
  {
    id: 2,
    title: "Projects",
    linkText: "Explore my work.",
    description: "Explore the projects I've built and contributed to.",
    link: "/projects",
    actionLabel: "View Projects",
    image:
      "https://res.cloudinary.com/dlcwqj2t2/image/upload/v1741233752/nextflix-p_wrcrxl.png",
  },
  {
    id: 3,
    title: "Connect",
    linkText: "Let's collaborate.",
    description: "Collaborate, inquire, or simply reach out and say hello.",
    link: "/contact",
    actionLabel: "Get in Touch",
    image:
      "https://res.cloudinary.com/dlcwqj2t2/image/upload/v1741129837/awlnnlyyy3j8ufyrrxda.jpg",
  },
];

const Home = () => {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [rotationSeed, setRotationSeed] = useState(0);

  useEffect(() => {
    const preloadImages = () => {
      const promises = data.map((item) => {
        return new Promise<void>((resolve, reject) => {
          const img = new window.Image();
          img.src = item.image;
          img.onload = () => resolve();
          img.onerror = () => reject();
        });
      });

      Promise.all(promises)
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    };

    preloadImages();

    return undefined;
  }, []);

  useEffect(() => {
    if (!isAutoRotate) {
      return undefined;
    }

    const interval = setInterval(() => {
      setSectionIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRotate, rotationSeed]);

  useEffect(() => {
    if (isLoading || typeof window === "undefined") return;
    if (window.location.hash === "#about") {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        setTimeout(() => {
          aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      }
    }
  }, [isLoading]);

  if (isLoading) {
    return <Loading size="lg" text="Decrypting data..." accent="red" fullScreen />;
  }

  return (
    <main className="relative isolate w-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-24 top-14 h-64 w-64 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute -bottom-12 left-1/3 h-56 w-56 rounded-full bg-orange-400/15 blur-3xl" />
      </div>

      <section className="flex py-10 sm:py-14 lg:py-16">
        <div className="mx-auto grid w-full max-w-[1600px] items-start gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] xl:gap-12 xl:px-10">
          <div className="text-left">
            <p
              className={`${jetBrainsMono.className} inline-flex rounded-full border border-red-300/30 bg-red-400/10 px-3 py-1 text-xs text-red-100`}
            >
              Web Developer Portfolio
            </p>
            <h1
              className={`${spaceGrotesk.className} mt-5 max-w-[17ch] text-[clamp(2rem,4.2vw,4.35rem)] font-bold leading-[1.03] tracking-tight`}
            >
              Building the Web, One Line at a Time
              <span className="mt-2 block text-red-400">I&apos;m Jon.</span>
            </h1>
            <p className="mt-5 max-w-[62ch] text-[clamp(1rem,1.5vw,1.18rem)] leading-relaxed text-gray-300">
              I&apos;m a web developer who loves building dynamic,
              high-performance websites! Experimenting with JavaScript tools
              feels like mixing ingredients to create the perfect recipe.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "TypeScript",
                "React",
                "Next.js",
                "Python/R (Data Analytics)",
              ].map((skill) => (
                <span
                  key={skill}
                  className={`${jetBrainsMono.className} rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200`}
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={data[sectionIndex].link}
                className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400"
              >
                {data[sectionIndex].actionLabel}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/#about"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:bg-black/35"
              >
                About Me
              </Link>
            </div>
          </div>

          <div className="w-full xl:pt-2">
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-900/60 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.9)] backdrop-blur">
              <div className="relative h-[clamp(290px,42vh,620px)] w-full">
                <Image
                  src={data[sectionIndex].image}
                  alt={data[sectionIndex].title}
                  fill
                  className="object-cover transition duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <h2
                    className={`${spaceGrotesk.className} text-3xl font-semibold tracking-tight text-white`}
                  >
                    {data[sectionIndex].title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-200">
                    {data[sectionIndex].linkText}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                aria-label={
                  isAutoRotate ? "Pause carousel autoplay" : "Play carousel autoplay"
                }
                aria-pressed={!isAutoRotate}
                onClick={() => setIsAutoRotate((prev) => !prev)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-black/20 text-slate-200 transition hover:border-white/45 hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70"
              >
                {isAutoRotate ? <Pause size={14} /> : <Play size={14} />}
              </button>
              {data.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSectionIndex(index);
                    if (isAutoRotate) {
                      setRotationSeed((prev) => prev + 1);
                    }
                  }}
                  className={`h-2.5 rounded-full transition-all ${
                    sectionIndex === index
                      ? "w-8 bg-red-500"
                      : "w-2.5 bg-white/35 hover:bg-white/60"
                  }`}
                  aria-label={`Show ${item.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14 pt-2 sm:pb-20">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-5 px-4 sm:px-6 md:grid-cols-3 xl:px-10">
          {data.map((item, index) => (
            <article
              key={item.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-slate-900/45 p-6 shadow-[0_14px_34px_-20px_rgba(0,0,0,0.8)] transition duration-300 hover:-translate-y-1 hover:border-red-300/50 hover:bg-slate-900/70"
            >
              <div
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-1 ${
                  index === 0
                    ? "bg-gradient-to-r from-red-500 to-orange-400"
                    : index === 1
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                      : "bg-gradient-to-r from-emerald-400 to-teal-500"
                }`}
              />
              <p
                className={`${jetBrainsMono.className} mb-3 text-xs tracking-widest text-slate-400`}
              >
                0{item.id}
              </p>
              <h3
                className={`${spaceGrotesk.className} mb-3 text-2xl font-semibold tracking-tight`}
              >
                {item.title}
              </h3>
              <p className="mb-7 text-sm leading-relaxed text-slate-300">
                {item.description}
              </p>
              <Link
                href={item.link}
                className="group/link mt-auto inline-flex w-fit items-center gap-2 text-sm font-semibold text-red-300 transition-colors duration-300 hover:text-red-200 focus-visible:text-red-200"
              >
                <span className="relative">
                  {item.actionLabel}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-red-200 transition-all duration-300 group-hover/link:w-full group-focus-visible/link:w-full" />
                </span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover/link:translate-x-1 group-focus-visible/link:translate-x-1"
                />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="scroll-mt-8">
        <AboutMe />
      </section>
    </main>
  );
};

export default Home;

