import React from "react";
import HeroCard from "../components/HeroCard";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center py-10 min-h-screen">
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
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <HeroCard
            title="Blog"
            description="Read my latest insights on web development."
            image="https://res.cloudinary.com/dlcwqj2t2/image/upload/v1741129836/jkcd9j7njrb6aylgfmnp.jpg"
            href="/blog"
          />
          <HeroCard
            title="Projects"
            description="Explore the projects I've built."
            image="https://res.cloudinary.com/dlcwqj2t2/image/upload/v1741129836/yuoq8uiphdohimxrodsb.png"
            href="/projects"
          />
          <HeroCard
            title="Connect"
            description="Collaborate, inquire, or simply reach out and say hello."
            image="https://res.cloudinary.com/dlcwqj2t2/image/upload/v1741129837/awlnnlyyy3j8ufyrrxda.jpg"
            href="/#contact"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
