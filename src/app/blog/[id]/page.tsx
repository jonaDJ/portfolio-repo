"use client";

import { ArrowLeft, Calendar, Clock, MessageSquare } from "lucide-react";
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

const formatDate = (dateString: string) => {
  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) {
    return dateString || "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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

  if (loading) {
    return <Loading size="lg" text="Loading post..." accent="blue" fullScreen />;
  }

  if (!blog) {
    return (
      <section className="px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-800 bg-gray-950/70 p-8 text-center">
          <h2 className="text-2xl font-semibold">Post Not Found</h2>
          <p className="mt-3 text-gray-300">
            The requested blog post could not be loaded.
          </p>
          <button
            onClick={() => router.push("/blog")}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-lg border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200 transition hover:border-blue-400/60 hover:bg-blue-500/20"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </button>
        </div>
      </section>
    );
  }

  const contentBlocks = (blog.content || [])
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section className="contact-grid-bg relative overflow-hidden px-3 py-8 text-white sm:px-5 lg:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="float-slow absolute left-10 top-20 h-28 w-28 rounded-full bg-blue-500/12 blur-3xl" />
        <div className="float-slow absolute bottom-12 right-10 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl [animation-delay:1.1s]" />
      </div>

      <div className="mx-auto w-full max-w-5xl">
        <button
          onClick={() => router.push("/blog")}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/60 px-4 py-2 text-sm text-gray-300 transition hover:border-blue-400/50 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          All posts
        </button>

        <article className="group rounded-[28px] border border-gray-800/70 bg-gray-950/70 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_35px_80px_-42px_rgba(59,130,246,0.45)] backdrop-blur-sm sm:p-8 lg:p-10">
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.09em] text-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <header className="mb-10">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              {blog.title || blog.blogTitle || "Untitled post"}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-400">
              <span className="font-medium text-gray-200">By Jon Darla</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formatReadTime(blog.readTime)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(blog.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                {blog.comments?.length || 0}
              </span>
            </div>
          </header>

          <div className="relative mb-10 h-60 w-full overflow-hidden rounded-2xl sm:h-80 lg:h-[30rem]">
            <Image
              src={blog.image}
              alt={blog.title || blog.blogTitle || "Blog post image"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          <div className="mx-auto max-w-[78ch]">
            {contentBlocks.length > 0 ? (
              <div className="space-y-7 sm:space-y-8">
                {contentBlocks.map((paragraph, index) => {
                  const isQuote = paragraph.startsWith(">");
                  const text = isQuote
                    ? paragraph.replace(/^>\s?/, "")
                    : paragraph;

                  if (isQuote) {
                    return (
                      <blockquote
                        key={`${text.slice(0, 24)}-${index}`}
                        className="rounded-r-xl border-l-4 border-blue-400/50 bg-blue-500/5 px-5 py-4 font-serif text-lg leading-8 text-gray-100"
                      >
                        {text}
                      </blockquote>
                    );
                  }

                  return (
                    <p
                      key={`${text.slice(0, 24)}-${index}`}
                      className={`font-serif tracking-[0.01em] text-gray-200/95 ${
                        index === 0
                          ? "text-[1.18rem] leading-9 text-gray-100 sm:text-[1.34rem] sm:leading-10 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-4xl first-letter:font-semibold first-letter:text-blue-200"
                          : "text-[1.075rem] leading-8 sm:text-[1.18rem] sm:leading-9"
                      }`}
                    >
                      {text}
                    </p>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400">Content is not available.</p>
            )}
          </div>
        </article>

        <div className="mt-8 rounded-[24px] border border-gray-800/70 bg-gray-950/65 p-5 backdrop-blur-sm sm:p-7">
          <div className="mx-auto max-w-[78ch]">
            <CommentSection
              blogId={String(id)}
              initialComments={blog.comments || []}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPost;

