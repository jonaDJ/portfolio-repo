"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchCollection } from "@/lib/firebase";
import { Clock, MessageSquare } from "lucide-react";
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
  createdAt?: any;
  comments?: Array<{
    name: string;
    cmt: string;
  }>;
}

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

  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatReadTime = (readTime?: string) => {
    if (!readTime) return "5 min read";

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

  if (loading) {
    return <Loading size="lg" text="Loading articles..." fullScreen />;
  }

  const filteredBlogs = blogs.filter((blog) => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    if (!normalizedQuery) return true;

    const excerpt = blog.content?.[0] || "";
    const searchTarget = `${blog.title || blog.blogTitle || ""} ${excerpt} ${
      blog.readTime || ""
    }`.toLowerCase();

    return searchTarget.includes(normalizedQuery);
  });

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-2 sm:py-10 text-white">
      <div className="text-center sm:mb-12 ">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          My <span className="text-blue-400">Blog</span>
        </h1>
        <p className="hidden sm:block text-gray-400 max-w-2xl mx-auto text-lg">
          Thoughts, tutorials, and insights on web development and design
        </p>
      </div>

      <div className="mb-6 sm:mb-8">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search blog posts..."
          inputId="blogSearch"
          label="Search blog posts"
        />
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">
            {blogs.length === 0 ? "No articles found" : "No matching posts"}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-800/70">
          {filteredBlogs.map((blog, index) => (
            <article key={blog.id} className="group py-6 sm:py-8">
              <Link href={`/blog/${blog.id}`}>
                <div className="flex items-start justify-between gap-4 sm:gap-6 md:gap-8 rounded-lg transition-colors duration-200 hover:bg-gray-900/30 p-2 sm:p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-400 mb-2">By Jon</p>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                      {blog.title || blog.blogTitle || "Untitled post"}
                    </h2>
                    <p className="text-gray-300 mb-4 line-clamp-2 sm:line-clamp-3">
                      {blog.content?.[0] || "No preview available."}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="text-blue-400">
                        {formatDate(blog.createdAt?.toDate?.() || blog.date)}
                      </span>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatReadTime(blog.readTime)}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        <span>{blog.comments?.length || 0}</span>
                      </div>
                      <span className="hidden sm:inline ml-auto text-blue-300 group-hover:text-blue-200 transition-colors">
                        Continue reading
                      </span>
                    </div>
                  </div>

                  <div className="relative w-28 h-20 sm:w-40 sm:h-24 md:w-44 md:h-28 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={blog.image}
                      alt={blog.title || blog.blogTitle || "Blog post image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 112px, (max-width: 768px) 160px, 176px"
                      priority={index < 2}
                    />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogPage;
