"use client";

import React, { useState, FormEvent } from "react";
import { addDoc } from "firebase/firestore";
import { messagesCollection } from "@/lib/firebase";
import { X, Send, Loader2 } from "lucide-react";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({ type: "", message: "" });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      valid = false;
    } else if (formData.message.length < 10) {
      newErrors.message = "Message should be at least 10 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await addDoc(messagesCollection, {
        ...formData,
        createdAt: new Date(),
      });

      setStatus({
        type: "success",
        message: "Message sent! I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus({
        type: "error",
        message: "Failed to send. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5" noValidate>
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-xs font-semibold uppercase tracking-[0.14em] text-gray-400"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your Name"
          disabled={loading}
          aria-invalid={Boolean(errors.name)}
          className="w-full rounded-xl border border-gray-700 bg-gray-900/80 px-4 py-3 text-white placeholder-gray-500 transition focus:border-emerald-400/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-70"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && (
          <p className="text-red-500 text-sm px-1">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-[0.14em] text-gray-400"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Your Email"
          disabled={loading}
          aria-invalid={Boolean(errors.email)}
          className="w-full rounded-xl border border-gray-700 bg-gray-900/80 px-4 py-3 text-white placeholder-gray-500 transition focus:border-emerald-400/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-70"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <p className="text-red-500 text-sm px-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-xs font-semibold uppercase tracking-[0.14em] text-gray-400"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Your Message"
          rows={6}
          disabled={loading}
          aria-invalid={Boolean(errors.message)}
          className="w-full rounded-xl border border-gray-700 bg-gray-900/80 px-4 py-3 text-white placeholder-gray-500 transition focus:border-emerald-400/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-70"
          value={formData.message}
          onChange={handleChange}
        />
        {errors.message && (
          <p className="text-red-500 text-sm px-1">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
          className={`group flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold transition-all duration-200 ${
          loading
            ? "cursor-not-allowed bg-emerald-700/80 text-emerald-100"
            : "bg-emerald-500 text-slate-950 hover:-translate-y-0.5 hover:bg-emerald-400"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            <span>Send Message</span>
          </>
        )}
      </button>

      {status.message && (
        <div
          role={status.type === "error" ? "alert" : "status"}
          aria-live={status.type === "error" ? "assertive" : "polite"}
          aria-atomic="true"
          className={`flex items-start justify-between rounded-xl border p-4 ${
            status.type === "success"
              ? "border-emerald-700/80 bg-emerald-950/40"
              : "border-red-700/80 bg-red-950/40"
          }`}
        >
          <p className="text-sm">{status.message}</p>
          <button
            type="button"
            onClick={() => setStatus({ type: "", message: "" })}
            aria-label="Dismiss status message"
            className="text-gray-300 hover:text-white ml-4"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </form>
  );
};
