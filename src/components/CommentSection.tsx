"use client";

import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type CommentEntry = {
  name: string;
  cmt: string;
};

interface CommentSectionProps {
  blogId: string;
  initialComments?: CommentEntry[];
}

const COMMENTS_PER_PAGE = 5;
const MAX_COMMENT_LENGTH = 300;
const MIN_COMMENT_LENGTH = 3;

const CommentSection = ({ blogId, initialComments = [] }: CommentSectionProps) => {
  const [comments, setComments] = useState<CommentEntry[]>(initialComments);
  const [commentPage, setCommentPage] = useState(1);
  const [comment, setComment] = useState({ name: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setComments(initialComments);
    setCommentPage(1);
  }, [initialComments]);

  const trimmedCommentText = comment.text.trim();
  const canSubmitComment =
    !isSubmitting &&
    comment.name.trim().length > 0 &&
    trimmedCommentText.length >= MIN_COMMENT_LENGTH;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitComment) return;

    try {
      setIsSubmitting(true);
      const newComment = {
        name: comment.name.trim(),
        cmt: trimmedCommentText,
      };

      await updateDoc(doc(db, "blog-data", blogId), {
        comments: arrayUnion(newComment),
      });

      setComments((prev) => {
        const next = [...prev, newComment];
        setCommentPage(1);
        return next;
      });
      setComment({ name: "", text: "" });
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitial = (name: string) => (name || "A").trim().charAt(0).toUpperCase();

  const getAvatarColor = (name: string) => {
    const palette = [
      "bg-red-600",
      "bg-orange-600",
      "bg-amber-600",
      "bg-lime-600",
      "bg-emerald-600",
      "bg-cyan-600",
      "bg-blue-600",
      "bg-indigo-600",
      "bg-fuchsia-600",
      "bg-pink-600",
    ];
    const key = (name || "Anonymous").trim();
    const hash = key.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return palette[hash % palette.length];
  };

  const orderedComments = [...comments].reverse();
  const totalCommentPages = Math.max(
    1,
    Math.ceil(orderedComments.length / COMMENTS_PER_PAGE)
  );
  const safeCommentPage = Math.min(commentPage, totalCommentPages);
  const startIndex = (safeCommentPage - 1) * COMMENTS_PER_PAGE;
  const visibleComments = orderedComments.slice(
    startIndex,
    startIndex + COMMENTS_PER_PAGE
  );

  return (
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
            maxLength={MAX_COMMENT_LENGTH}
            value={comment.text}
            onChange={(e) => setComment({ ...comment, text: e.target.value })}
            required
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              {comment.text.length}/{MAX_COMMENT_LENGTH}
            </span>
            {trimmedCommentText.length === 0 && (
              <span className="text-gray-500">Comment cannot be empty.</span>
            )}
            {trimmedCommentText.length > 0 &&
              trimmedCommentText.length < MIN_COMMENT_LENGTH && (
                <span className="text-gray-500">
                  Comment must be at least {MIN_COMMENT_LENGTH} characters.
                </span>
              )}
          </div>
          <button
            type="submit"
            disabled={!canSubmitComment}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900/50 disabled:text-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {orderedComments.length > 0 ? (
          visibleComments.map((entry, index) => (
            <div
              key={`${entry.name}-${startIndex + index}`}
              className="p-4 bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white ${getAvatarColor(
                    entry.name
                  )}`}
                  aria-label={`Avatar for ${entry.name || "Anonymous"}`}
                >
                  {getInitial(entry.name)}
                </div>
                <div>
                  <h4 className="font-medium">{entry.name || "Anonymous"}</h4>
                </div>
              </div>
              <p className="text-gray-300">{entry.cmt}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No comments yet.</p>
        )}

        {orderedComments.length > COMMENTS_PER_PAGE && (
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCommentPage((prev) => Math.max(1, prev - 1))}
              disabled={safeCommentPage === 1}
              className="px-3 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {safeCommentPage} of {totalCommentPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setCommentPage((prev) => Math.min(totalCommentPages, prev + 1))
              }
              disabled={safeCommentPage === totalCommentPages}
              className="px-3 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentSection;
