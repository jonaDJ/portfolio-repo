"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { db } from "@/lib/firebase"; // Adjust the import path
import { collection, getDocs } from "firebase/firestore";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  demoLink?: string;
  codeLink: string;
}

const ProjectPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [cardId, setCardId] = useState<number>(-1);
  const [projects, setProjects] = useState<Project[]>([]);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchQuery]);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  return (
    <section className="flex flex-col items-center py-10 bg-gray-950 text-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold">My Projects</h2>
        <p className="mt-4 text-lg text-gray-300">
          Here are some of the projects I've worked on. Feel free to explore!
        </p>
      </div>

      <div className="w-full mb-12">
        <div className="relative">
          <label htmlFor="projectSearch" className="sr-only">
            Search projects...
          </label>
          <input
            type="search"
            id="projectSearch"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow "
        style={{ width: "calc(100vw - 100px)" }}
      >
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            image={project.image}
            title={project.title}
            description={project.description}
            demoLink={project.demoLink || ""}
            codeLink={project.codeLink}
            cardId={cardId}
            setCardId={setCardId}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectPage;
