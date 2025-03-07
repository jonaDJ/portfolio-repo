"use client";

import React, { useState, FormEvent } from "react";
import { addDoc } from "firebase/firestore";
import { messagesCollection } from "@/lib/firebase";
import { X } from "lucide-react";

export const ContactForm = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({
    type: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const validateForm = (): boolean => {
    let valid = true;
    let newErrors: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    if (!message.trim()) {
      newErrors.message = "Message is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
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
        name,
        email,
        message,
        createdAt: new Date(),
      });

      setStatus({
        type: "success",
        message:
          "Thanks for reaching out! I’ll respond to your message shortly.",
      });

      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
      setStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-lg mx-auto flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <div className="w-full max-w-lg mx-auto flex flex-col">
        <input
          type="text"
          placeholder="Your Name"
          className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="h-5">
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name}</span>
          )}
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto flex flex-col">
        <input
          type="text"
          placeholder="Your Email"
          className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="h-5">
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto flex flex-col">
        <textarea
          placeholder="Your Message"
          rows={4}
          className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <div className="h-5">
          {errors.message && (
            <span className="text-red-500 text-sm">{errors.message}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`px-6 py-3 ${
          loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
        } text-white font-medium rounded-full transition focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
      {status.message && (
        <div
          className={`relative p-3 rounded-lg text-white flex justify-between items-center ${
            status.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <span>{status.message}</span>
          <button
            onClick={() => setStatus({ type: "", message: "" })}
            className="ml-4 text-white hover:text-gray-200"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </form>
  );
};
