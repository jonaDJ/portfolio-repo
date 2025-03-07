"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCollection } from "@/lib/firebase";

interface Blog {
  id: string;
  overview: string;
  date: string;
  image: string;
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCollection<Blog>("blog-data", [
        "image",
        "overview",
        "date",
      ]);
      setBlogs(data);
    };

    fetchData();
  }, []);

  return (
    <section className="mx-auto p-0 bg-black text-white sm:p-6 overflow-hidden pt-3 pb-20 sm:pb-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb- sm:mb-8 text-center">
        Latest Blogs
      </h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.id}`} passHref>
            <div className="border border-gray-700 rounded-0 sm:rounded-md overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-transform transform hover:scale-102 bg-gray-800 flex flex-col h-full">
              <img
                src={blog.image}
                alt={`Blog post: ${blog.overview.substring(0, 20)}...`}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 flex flex-col flex-grow">
                <p className="text-gray-300 text-md flex-grow overflow-hidden text-overflow-ellipsis whitespace-normal">
                  {blog.overview}
                </p>
                <div className="text-gray-400 text-xs mt-4">{blog.date}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BlogPage;
