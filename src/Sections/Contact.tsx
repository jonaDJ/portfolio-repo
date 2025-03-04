import React from "react";
import { Book, Github, Linkedin } from "lucide-react";

// JSON data for social links
const socialLinks = [
  {
    id: 1,
    href: "https://yourblog.com",
    icon: <Book size={24} className="text-blue-500" />,
    label: "Blog",
    description: "Read my latest articles",
  },
  {
    id: 2,
    href: "https://github.com/yourusername",
    icon: <Github size={24} className="text-purple-500" />,
    label: "GitHub",
    description: "Check out my projects",
  },
  {
    id: 3,
    href: "https://linkedin.com/in/yourusername",
    icon: <Linkedin size={24} className="text-blue-400" />,
    label: "LinkedIn",
    description: "Connect with me",
  },
];

const Contact = () => {
  return (
    <section className="flex flex-col items-center justify-center p-10 bg-gray-950 text-white min-h-screen">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold">Get in Touch</h2>
        <p className="mt-4 text-lg text-gray-300">
          Let's work together, say hi, or ask a question!
        </p>
      </div>

      {/* Content Container */}
      <div className="w-full flex flex-col md:flex-row gap-8">
        {/* Left Side - 1/4 Width */}
        <div className="w-full md:w-1/4">
          <p className="text-gray-300 text-lg">
            Whether you have a project idea, a question, or just want to
            connect, I’d love to hear from you! Let's connect!
          </p>
        </div>

        {/* Right Side - 3/4 Width */}
        <div className="w-full md:w-3/4">
          <form className="w-full max-w-lg mx-auto flex flex-col gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded-full transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Social Links */}
      <div className="mt-12 w-full">
        <div className="flex flex-row gap-6 justify-center">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="flex items-center justify-center md:justify-start gap-4 p-4 bg-gray-900 border border-gray-800 rounded-lg transition hover:bg-gray-800 hover:border-gray-700 md:flex-1 max-w-xs md:max-w-md"
            >
              {link.icon}
              <div className="hidden sm:block">
                <p className="font-medium">{link.label}</p>
                <p className="text-sm text-gray-400">{link.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
