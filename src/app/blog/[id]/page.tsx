"use client";

import { ArrowLeftCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchDocumentById } from "@/lib/firebase";

interface Blog {
  id: string;
  content: string[];
  date: string;
  image: string;
  overview: string;
}

const BlogPost = () => {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (id) {
        const blogData = await fetchDocumentById("blog-data", String(id));
        setBlog(blogData as Blog);
      }
    };

    fetchBlogData();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleSubmitComment = () => {
    //TODO
  };

  if (!blog) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Blog post not found.
      </div>
    );
  }

  return (
    <div className="mx-auto p-1 bg-black text-white pb-30 pt-5 sm:pb-1 sm:pt-1">
      <div className="flex justify-start mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftCircle />
          <span className="text-md">Back</span>
        </button>
      </div>

      <div className="space-y-6">
        <div className="relative w-full h-[50vh]">
          <Image
            src={blog.image}
            alt={`Blog post`}
            fill
            className="object-cover shadow-md shadow-gray-700"
          />
        </div>

        <div className="text-sm text-gray-400">{blog.date}</div>

        <div className="text-lg p-3 text-gray-200 whitespace-pre-line leading-relaxed">
          {blog.content.length > 0 ? (
            blog.content.map((contentItem, index) => (
              <p key={index} className="mb-4">
                {contentItem}
              </p>
            ))
          ) : (
            <p>Content is not available.</p>
          )}
        </div>

        <div className="mt-10 px-4">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>

          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <textarea
                placeholder="Your Comment"
                className="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                rows={4}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Submit Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
