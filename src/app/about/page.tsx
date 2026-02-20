"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  LucideLaptop2,
  LucideLightbulb,
  LucideMapPin,
  LucideRocket,
  LucideTarget,
} from "lucide-react";
import { SocialLinks } from "@/components/SocialLinks";
import { fetchDocumentById } from "@/lib/firebase";
import Loading from "@/components/Loading";

interface AboutMeProps {
  name: string;
  title: string;
  avatarUrl?: string;
  bio: string;
  expertise: string[];
  passions: string[];
  location: string;
  hobbies: string[];
  more: string[];
  techJourney: string[];
}

const AboutMe = () => {
  const [data, setData] = useState<AboutMeProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const aboutData = await fetchDocumentById("about-me", "jon");
        if (!active) {
          return;
        }
        setData((aboutData as AboutMeProps) || null);
      } catch (error) {
        console.error("Error fetching about me data:", error);
        if (active) {
          setData(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchAboutData();

    return () => {
      active = false;
    };
  }, []);

  const initials = useMemo(() => {
    if (!data?.name) {
      return "JD";
    }
    return data.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [data?.name]);

  if (loading) {
    return <Loading size="lg" text="Loading about..." accent="cyan" fullScreen />;
  }

  if (!data) {
    return (
      <section className="px-4 py-10 text-white sm:px-6 xl:px-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-800 bg-gray-950/70 p-8 text-center">
          <h2 className="text-2xl font-semibold">About data unavailable</h2>
          <p className="mt-3 text-gray-300">
            Could not load your profile document from Firestore.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-grid-bg relative overflow-hidden px-4 py-10 text-white sm:px-6 xl:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="float-slow absolute right-8 top-20 h-28 w-28 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="float-slow absolute bottom-12 left-10 h-32 w-32 rounded-full bg-blue-500/15 blur-3xl [animation-delay:1s]" />
      </div>

      <div className="mx-auto w-full max-w-[1600px] space-y-8">
        <div className="reveal-up text-center">
          <p className="mb-3 inline-block rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            About
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Developer Profile
          </h1>
        </div>

        <div className="reveal-up reveal-delay-1 grid grid-cols-1 gap-6 rounded-2xl border border-gray-800/80 bg-gray-950/60 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_70px_-35px_rgba(8,145,178,0.45)] backdrop-blur-sm sm:p-8 lg:grid-cols-12">
          <aside className="lg:col-span-4 xl:col-span-3 xl:sticky xl:top-8 xl:self-start">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6">
              <div className="mb-5 flex justify-center">
                {data.avatarUrl ? (
                  <Image
                    src={data.avatarUrl}
                    alt={data.name}
                    width={144}
                    height={144}
                    className="h-36 w-36 rounded-full border-4 border-gray-700 object-cover"
                  />
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-gray-700 bg-gray-800 text-4xl font-bold text-cyan-300">
                    {initials}
                  </div>
                )}
              </div>

              <h2 className="text-center text-2xl font-semibold">{data.name}</h2>
              <p className="mt-1 text-center text-gray-300">{data.title}</p>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                <LucideMapPin className="h-4 w-4" />
                <span>{data.location}</span>
              </div>

              <div className="mt-6" id="contact">
                <SocialLinks iconsOnly={true} />
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8 xl:col-span-9">
            <article className="rounded-2xl border border-gray-800 bg-gray-900/55 p-6 sm:p-7">
              <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold">
                <LucideRocket className="h-5 w-5 text-cyan-300" />
                About
              </h3>
              <p className="leading-relaxed text-gray-300">{data.bio}</p>
              <a
                href="#additional-info"
                className="mt-4 inline-block text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
              >
                Learn More
              </a>
            </article>

            <article className="mt-6 rounded-2xl border border-gray-800 bg-gray-900/55 p-6 sm:p-7">
              <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold">
                <LucideLaptop2 className="h-5 w-5 text-cyan-300" />
                My Tech Journey
              </h3>
              <ul className="space-y-4">
                {data.techJourney.map((item, index) => (
                  <li key={`${item}-${index}`} className="relative pl-8">
                    <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-cyan-400" />
                    {index < data.techJourney.length - 1 && (
                      <span className="absolute left-[5px] top-5 h-[calc(100%-4px)] w-px bg-gray-700" />
                    )}
                    <p className="text-gray-300">{item}</p>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>

        <section
          id="additional-info"
          className="reveal-up reveal-delay-2 scroll-mt-16 rounded-2xl border border-gray-800/80 bg-gray-950/60 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-8"
        >
          <h3 className="mb-5 text-2xl font-semibold">More About Me</h3>

          <div className="space-y-4">
            {data.more.map((item, index) => (
              <p key={`${item}-${index}`} className="leading-relaxed text-gray-300">
                {item}
              </p>
            ))}
          </div>

          <div className="mt-8 space-y-7">
            <div>
              <h4 className="mb-3 text-lg font-semibold">Core Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {data.expertise.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="rounded-full border border-gray-700 bg-gray-800/80 px-3 py-1 text-sm text-gray-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <LucideLightbulb className="h-5 w-5 text-amber-300" />
                Hobbies and Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.hobbies.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="rounded-full border border-amber-900/60 bg-amber-900/20 px-3 py-1 text-sm text-amber-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <LucideTarget className="h-5 w-5 text-cyan-300" />
                Passions
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.passions.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="rounded-full border border-cyan-900/60 bg-cyan-900/20 px-3 py-1 text-sm text-cyan-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AboutMe;

