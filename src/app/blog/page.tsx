"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, MessageSquare } from "lucide-react";
import { fetchCollection } from "@/lib/firebase";
import Loading from "@/components/Loading";
import SearchBar from "@/components/SearchBar";

interface Blog {
  id: string;
  title?: string;
  blogTitle?: string;
  content?: string[];
  date: string;
  image: string;
  readTime?: string;
  createdAt?: {
    toDate?: () => Date;
  };
  comments?: Array<{
    name: string;
    cmt: string;
  }>;
}

const formatDate = (dateInput: string | Date) => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatReadTime = (readTime?: string) => {
  if (!readTime) {
    return "5 min read";
  }

  const value = readTime.trim().toLowerCase();
  const timeMatch = value.match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
  if (timeMatch) {
    const first = Number(timeMatch[1]);
    const second = Number(timeMatch[2]);
    const third = timeMatch[3] ? Number(timeMatch[3]) : 0;
    const totalSeconds = timeMatch[3]
      ? first * 3600 + second * 60 + third
      : first * 60 + second;
    const minutes = Math.max(1, Math.ceil(totalSeconds / 60));
    return `${minutes} min read`;
  }

  const numberMatch = value.match(/\d+/);
  if (numberMatch) {
    const minutes = Math.max(1, Number(numberMatch[0]));
    return `${minutes} min read`;
  }

  return "5 min read";
};

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCollection<Blog>("blog-data", [
          "title",
          "blogTitle",
          "image",
          "content",
          "date",
          "readTime",
          "createdAt",
          "comments",
        ]);

        const sortedBlogs = data.sort((a, b) => {
          const dateA = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(a.date);
          const dateB = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(b.date);

          return dateB.getTime() - dateA.getTime();
        });

        setBlogs(sortedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBlogs = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    if (!normalizedQuery) {
      return blogs;
    }

    return blogs.filter((blog) => {
      const excerpt = blog.content?.[0] || "";
      const searchTarget = `${blog.title || blog.blogTitle || ""} ${excerpt} ${
        blog.readTime || ""
      }`.toLowerCase();

      return searchTarget.includes(normalizedQuery);
    });
  }, [blogs, searchQuery]);

  if (loading) {
    return <Loading size="lg" text="Loading articles..." accent="blue" fullScreen />;
  }

  return (
    <section className="contact-grid-bg relative overflow-hidden px-4 py-10 text-white sm:px-6 xl:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="float-slow absolute left-10 top-20 h-28 w-28 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="float-slow absolute bottom-12 right-10 h-32 w-32 rounded-full bg-sky-500/12 blur-3xl [animation-delay:1.1s]" />
      </div>

      <div className="mx-auto w-full max-w-[1600px]">
        <header className="reveal-up mb-8 text-center sm:mb-10">
          <p className="mb-3 inline-block rounded-full border border-blue-400/35 bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            Blog
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Writing for Builders
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-gray-300 sm:text-lg">
            Practical notes on web development, architecture, and product
            thinking.
          </p>
        </header>

        <div className="reveal-up reveal-delay-1 rounded-2xl border border-gray-800/80 bg-gray-950/60 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_70px_-35px_rgba(59,130,246,0.4)] backdrop-blur-sm sm:p-6 lg:p-8">
          <SearchBar
            onSearch={setSearchQuery}
            accent="blue"
            placeholder="Search articles..."
            inputId="blogSearch"
            label="Search blog posts"
          />

          {filteredBlogs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900/60 p-8 text-center">
              <h2 className="text-xl font-semibold">No matching posts</h2>
              <p className="mt-2 text-gray-400">
                Try a different keyword to find the article you want.
              </p>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-gray-800/70">
              {filteredBlogs.map((blog, index) => (
                <article key={blog.id} className="group py-5 sm:py-6">
                  <Link
                    href={`/blog/${blog.id}`}
                    className="block rounded-xl p-2 transition-colors hover:bg-gray-900/40 sm:p-3"
                  >
                    <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6">
                      <div className="min-w-0 flex-1">
                        <p className="mb-2 text-sm text-gray-400">
                          Jon Darla -{" "}
                          {formatDate(blog.createdAt?.toDate?.() || blog.date)}
                        </p>

                        <h2 className="text-2xl font-bold leading-tight text-white transition-colors group-hover:text-blue-300 sm:text-3xl">
                          {blog.title || blog.blogTitle || "Untitled post"}
                        </h2>

                        <p
                          className="mt-3 text-gray-300"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {blog.content?.[0] || "No preview available."}
                        </p>

                        <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatReadTime(blog.readTime)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {blog.comments?.length || 0}
                          </span>
                          <span className="ml-auto hidden items-center gap-1 text-blue-300 transition-colors group-hover:text-blue-200 group-focus-visible:text-blue-200 sm:inline-flex">
                            Continue reading
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
                          </span>
                        </div>
                      </div>

                      <div className="relative order-first h-44 w-full overflow-hidden rounded-lg sm:order-none sm:h-24 sm:w-40 md:h-28 md:w-44 xl:h-32 xl:w-52">
                        <Image
                          src={blog.image}
                          alt={blog.title || blog.blogTitle || "Blog post image"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 160px, (max-width: 1280px) 176px, 208px"
                          priority={index < 2}
                        />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogPage;


