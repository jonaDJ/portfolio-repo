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
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-4">
      <div className="space-y-1">
        <input
          name="name"
          type="text"
          placeholder="Your Name"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && (
          <p className="text-red-500 text-sm px-1">{errors.name}</p>
        )}
      </div>

      <div className="space-y-1">
        <input
          name="email"
          type="email"
          placeholder="Your Email"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <p className="text-red-500 text-sm px-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-1">
        <textarea
          name="message"
          placeholder="Your Message"
          rows={5}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition ${
          loading
            ? "bg-blue-600 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            <span>Send Message</span>
          </>
        )}
      </button>

      {status.message && (
        <div
          className={`p-4 rounded-lg flex items-start justify-between ${
            status.type === "success"
              ? "bg-green-900/50 border border-green-700"
              : "bg-red-900/50 border border-red-700"
          }`}
        >
          <p className="text-sm">{status.message}</p>
          <button
            onClick={() => setStatus({ type: "", message: "" })}
            className="text-gray-300 hover:text-white ml-4"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </form>
  );
};
