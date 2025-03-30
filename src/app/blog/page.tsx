"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchCollection } from "@/lib/firebase";
import { Clock, ArrowRight } from "lucide-react";
import Loading from "@/components/Loading";

interface Blog {
  id: string;
  title?: string; //I will add later
  overview: string;
  date: string;
  image: string;
  readTime?: string;
  createdAt?: any;
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCollection<Blog>("blog-data", [
          "title",
          "image",
          "overview",
          "date",
          "readTime",
          "createdAt",
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

  if (loading) {
    return <Loading size="lg" text="Loading articles..." fullScreen />;
  }

  return (
    <section className="max-w-6xl mx-auto sm:px-6 py-2 sm:py-10  text-white">
      <div className="text-center sm:mb-12 ">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          My <span className="text-blue-400">Blog</span>
        </h1>
        <p className="hidden sm:block text-gray-400 max-w-2xl mx-auto text-lg">
          Thoughts, tutorials, and insights on web development and design
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">No articles found</p>
        </div>
      ) : (
        <div className="space-y-12">
          {blogs.map((blog) => (
            <article key={blog.id} className="group">
              <Link href={`/blog/${blog.id}`} passHref>
                <div className="flex flex-col sm:flex-row gap-8 hover:bg-gray-900/50 p-0 rounded-lg transition-all duration-300">
                  <div className=" sm:w-1/2 md:w-1/3 relative h-64 overflow-hidden sm:rounded-lg">
                    <Image
                      src={blog.image}
                      alt={blog.title || blog.overview.substring(0, 50)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={blogs.indexOf(blog) < 3}
                    />
                  </div>
                  <div className="px-4 sm:px-0 sm:w-1/2 md:w-2/3 flex flex-col">
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="text-blue-400">
                        {formatDate(blog.createdAt?.toDate?.() || blog.date)}
                      </span>
                      <div className="flex">
                        <Clock className="w-4 h-4 mr-1 mt-0.5" />
                        <span>{blog.readTime || "5 min read"}</span>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 hover:text-blue-400 transition-colors">
                      {blog.title || blog.overview.substring(0, 50) + "..."}
                    </h2>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {blog.overview}
                    </p>
                    <div className="mt-auto flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                      <span>Continue reading</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
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
