"use client";

import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FolderOpenDot } from "lucide-react";
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
            date: data.date || new Date().toISOString().split("T")[0],
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

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return projects;
    }
    return projects.filter((project) =>
      project.title.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) {
    return <Loading size="lg" text="Loading projects..." accent="orange" fullScreen />;
  }

  return (
    <section className="contact-grid-bg relative overflow-hidden px-4 py-10 text-white sm:px-6 xl:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="float-slow absolute left-10 top-20 h-28 w-28 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="float-slow absolute bottom-12 right-10 h-32 w-32 rounded-full bg-amber-500/12 blur-3xl [animation-delay:1.1s]" />
      </div>

      <div className="mx-auto w-full max-w-[1600px]">
        <div className="reveal-up mb-8 text-center sm:mb-10">
          <p className="mb-3 inline-block rounded-full border border-orange-400/35 bg-orange-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
            Projects
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Built with Product Thinking
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-gray-300 sm:text-lg">
            Real-world projects focused on clarity, performance, and developer
            experience.
          </p>
        </div>

        <div className="reveal-up reveal-delay-1 rounded-2xl border border-gray-800/80 bg-gray-950/60 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_70px_-35px_rgba(249,115,22,0.45)] backdrop-blur-sm sm:p-6 lg:p-8">
          <SearchBar
            onSearch={handleSearch}
            accent="orange"
            placeholder="Search projects by title..."
          />

          {filteredProjects.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900/60 p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-300">
                <FolderOpenDot className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold">No projects found</h2>
              <p className="mt-2 text-gray-400">
                Try a different keyword to find a matching project.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  image={project.image}
                  title={project.title}
                  description={project.description}
                  demoLink={project.demoLink || ""}
                  codeLink={project.codeLink}
                  date={project.date}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectPage;

