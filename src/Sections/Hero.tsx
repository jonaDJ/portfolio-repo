import React from "react";
import HeroCard from "../components/HeroCard";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center p-10 bg-gray-950 text-white min-h-screen">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl sm:text-5xl font-bold">
          Hey, Welcome to my page. I am{" "}
          <span className="text-blue-400">Jon</span>
        </h1>
        <p className="mt-4 text-lg">
          I'm a web developer who loves building dynamic, high-performance
          websites! Experimenting with JavaScript tools feels like mixing
          ingredients to create the perfect recipe.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <HeroCard
            title="Blog"
            description="Read my latest insights on web development."
            image="/images/blog.jpg"
            href="/"
          />
          <HeroCard
            title="Projects"
            description="Explore the projects I've built."
            image="/images/project.png"
            href="/"
          />
          <HeroCard
            title="Contact"
            description="Let's collaborate, say hi, or schedule an interview!"
            image="/images/contact.jpg"
            href="/"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
