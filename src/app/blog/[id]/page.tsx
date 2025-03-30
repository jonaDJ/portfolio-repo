"use client";

import { ArrowLeft, Calendar, Clock, MessageSquare } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchDocumentById } from "@/lib/firebase";
import Loading from "@/components/Loading";

interface Blog {
  id: string;
  title?: string;
  content: string[];
  date: string;
  image: string;
  overview: string;
  readTime?: string;
  tags?: string[];
}

const BlogPost = () => {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState({
    name: "",
    text: "",
  });

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

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement comment submission
    console.log("Comment submitted:", comment);
    setComment({ name: "", text: "" });
  };

  if (loading) {
    return <Loading size="lg" text="Loading article..." fullScreen />;
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black sm:bg-[#0a0a0a] text-white p-6">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <p className="text-gray-400 mb-6">
          The requested article could not be loaded.
        </p>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Articles
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
        <span className="text-md">All Articles</span>
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
          {blog.title || blog.overview.substring(0, 50) + "..."}
        </h1>
        <div className="flex items-center gap-4 text-gray-400 text-sm">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{blog.readTime || "5 min read"}</span>
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
          alt={blog.title || "Blog post image"}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Article Content */}
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

      <section className="border-t border-gray-800 pt-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageSquare size={24} />
          Comments
        </h2>

        <form onSubmit={handleSubmitComment} className="mb-10">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={comment.name}
              onChange={(e) => setComment({ ...comment, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Share your thoughts..."
              className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              rows={4}
              value={comment.text}
              onChange={(e) => setComment({ ...comment, text: e.target.value })}
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              Post Comment
            </button>
          </div>
        </form>

        {/* Comment List */}
        <div className="space-y-6">
          {/* Example comment - replace with actual comments from your data */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-700"></div>
              <div>
                <h4 className="font-medium">John Doe</h4>
                <p className="text-gray-400 text-sm">2 days ago</p>
              </div>
            </div>
            <p className="text-gray-300">
              Great article! Really enjoyed reading this.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
