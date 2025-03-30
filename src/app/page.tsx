"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Loading from "@/components/Loading";

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

  useEffect(() => {
    // Preload images with proper type annotation
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

    const interval = setInterval(() => {
      setSectionIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <Loading size="lg" text="Decrypting data..." fullScreen />;
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <section className="flex flex-col max-w-6xl items-center justify-center text-center py-10 px-4 sm:px-6">
        <div className="w-full">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Building the Web, One Line at a Time – I'm{" "}
            <span className="text-red-500">Jon!</span>
          </h1>
          <p className="mt-4 text-gray-300 text-lg">
            I'm a web developer who loves building dynamic, high-performance
            websites! Experimenting with JavaScript tools feels like mixing
            ingredients to create the perfect recipe.
          </p>

          <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg my-10">
            <Image
              src={data[sectionIndex].image}
              alt={data[sectionIndex].title}
              fill
              priority
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white p-5">
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                  {data[sectionIndex].title}
                </h2>
                <p className="text-gray-200">{data[sectionIndex].linkText}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-12">
            {data.map((_, index) => (
              <button
                key={index}
                onClick={() => setSectionIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  sectionIndex === index ? "bg-red-500" : "bg-gray-400"
                }`}
                aria-label={`Show ${data[index].title}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center text-center p-6  rounded-lg  h-full"
              >
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-300 mb-6 flex-grow">
                  {item.description}
                </p>
                <Link
                  href={item.link}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors w-fit"
                >
                  {item.actionLabel}
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
