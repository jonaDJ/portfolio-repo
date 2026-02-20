"use client";

import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchDocumentById } from "@/lib/firebase";
import Loading from "@/components/Loading";
import CommentSection from "@/components/CommentSection";

interface Blog {
  id: string;
  title?: string;
  blogTitle?: string;
  content: string[];
  date: string;
  image: string;
  readTime?: string;
  tags?: string[];
  comments?: Array<{
    name: string;
    cmt: string;
  }>;
}

const BlogPost = () => {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        if (id) {
          const blogData = await fetchDocumentById("blog-data", String(id));
          setBlog(blogData as Blog);
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  const handleBack = () => {
    router.back();
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
    return <Loading size="lg" text="Loading post..." fullScreen />;
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black sm:bg-[#0a0a0a] text-white p-6">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <p className="text-gray-400 mb-6">
          The requested blog post could not be loaded.
        </p>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-black sm:bg-[#0a0a0a] text-white min-h-screen p-4 sm:p-6">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-md">All Posts</span>
      </button>

      <header className="mb-10">
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-3 hover:text-blue-400 transition-colors">
          {blog.title || blog.blogTitle || "Untitled post"}
        </h1>
        <div className="flex items-center gap-4 text-gray-400 text-sm">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{formatReadTime(blog.readTime)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{blog.date}</span>
          </div>
        </div>
      </header>

      <div className="relative w-full h-64 sm:h-96 mb-10 sm:rounded-md overflow-hidden">
        <Image
          src={blog.image}
          alt={blog.title || blog.blogTitle || "Blog post image"}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Post Content */}
      <article className="prose prose-invert max-w-none mb-16">
        {blog.content.length > 0 ? (
          blog.content.map((paragraph, index) => (
            <p key={index} className="mb-6 text-gray-300 leading-relaxed">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-gray-400">Content is not available.</p>
        )}
      </article>

      <CommentSection blogId={String(id)} initialComments={blog.comments || []} />
    </div>
  );
};

export default BlogPost;
