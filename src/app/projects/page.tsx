"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProjectCard from "@/components/ProjectCard";
import SearchBar from "@/components/SearchBar";
import Loading from "@/components/Loading";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  demoLink?: string;
  codeLink: string;
  date: string;
}

const ProjectPage = () => {
  const [cardId, setCardId] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            image: data.image,
            demoLink: data.demoLink,
            codeLink: data.codeLink,
            date: data.date || new Date().toISOString().split("T")[0], // Default to today's date
          };
        });

        const sortedData = projectsData.sort((a, b) =>
          b.date.localeCompare(a.date)
        );

        setProjects(sortedData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return <Loading size="lg" text="Loading projects..." fullScreen />;
  }

  return (
    <section className="flex flex-col items-center bg-gray-950 text-white pb-30 pt-4 sm:pt-10 sm:pb-10 sm:px-2 lg:px-10">
      <div className="hidden sm:block text-center p-1">
        <h2 className="text-3xl sm:text-5xl font-bold">My Projects</h2>
        <p className="mt-2 text-md sm:text-lg text-gray-300">
          Here are some of the projects I've worked on. Feel free to explore!
        </p>
      </div>

      <SearchBar onSearch={handleSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full gap-10 sm:gap-4 px-2 py-3">
        {filteredProjects.map((p, idx) => (
          <ProjectCard
            key={p.id}
            id={idx}
            image={p.image}
            title={p.title}
            description={p.description}
            demoLink={p.demoLink || ""}
            codeLink={p.codeLink}
            date={p.date}
            cardId={cardId}
            setCardId={setCardId}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectPage;
