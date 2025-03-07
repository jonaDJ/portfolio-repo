"use client";

import React, { useState, useEffect } from "react";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import ProjectCard from "@/components/ProjectCard";
import SearchBar from "@/components/SearchBar";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  demoLink?: string;
  codeLink: string;
}

const ProjectPage = () => {
  const [cardId, setCardId] = useState<number>(-1);

  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blog"));
        const projectsData: Project[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          projectsData.push({
            id: data.id,
            title: data.title,
            description: data.description,
            image: data.image,
            demoLink: data.demoLink,
            codeLink: data.codeLink,
          });
        });
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <section className="flex flex-col items-center pt-10 bg-gray-950 text-white pb-30 sm:pb-10">
      <div className="text-center p-1">
        <h2 className="text-3xl sm:text-5xl font-bold">My Projects</h2>
        <p className="mt-2 text-md sm:text-lg text-gray-300">
          Here are some of the projects I've worked on. Feel free to explore!
        </p>
      </div>

      <SearchBar onSearch={handleSearch} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full gap-10 sm:gap-2 px-2 py-3">
        {filteredProjects.map((p) => (
          <ProjectCard
            key={p.id}
            id={p.id}
            image={p.image}
            title={p.title}
            description={p.description}
            demoLink={p.demoLink || ""}
            codeLink={p.codeLink}
            cardId={cardId}
            setCardId={setCardId}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectPage;
