"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setSectionIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % 3;
        if (newIndex !== prevIndex) {
          return newIndex;
        }
        return prevIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center">
      <section className="flex flex-col max-w-6xl items-center justify-center text-center py-10 pb-30 sm:pb-0">
        <div className="w-full">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Building the Web, One Line at a Time – I'm{" "}
            <span className="text-red-500">Jon!</span>
          </h1>
          <p className="mt-2 text-md ">
            I'm a web developer who loves building dynamic, high-performance
            websites! Experimenting with JavaScript tools feels like mixing
            ingredients to create the perfect recipe.
          </p>

          <div className="relative h-80 sm:h-96 rounded-lg overflow-hidden shadow-lg mb-8 mt-8">
            <Image
              src={data[sectionIndex].image}
              alt={data[sectionIndex].title}
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              className="z-0 opacity-50"
            />

            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-white p-5 rounded-full">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  {data[sectionIndex].title}
                </h1>
                <p className="text-sm sm:text-md">
                  {data[sectionIndex].linkText}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-2 mb-12">
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSectionIndex(index);
                  }}
                  aria-label={`Go to ${data[index].title} section`}
                  className={`w-5 h-2 rounded-full cursor-pointer ${
                    sectionIndex === index ? "bg-red-500" : "bg-amber-50"
                  } `}
                ></div>
              ))}
          </div>

          <div className="flex flex-col justify-center sm:flex-row gap-10 sm:gap-8">
            {data.map((d) => (
              <div key={d.id} className="text-center">
                <h2 className="text-xl font-semibold mb-2">{d.title}</h2>
                <p className="text-sm mb-4">{d.description}</p>
                <Link
                  href={d.link}
                  className="inline-flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-gray-800"
                >
                  {d.actionLabel}
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
