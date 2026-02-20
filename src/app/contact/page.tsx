import React from "react";
import { ContactForm } from "@/components/ContactForm";
import { SocialLinks } from "@/components/SocialLinks";

const ContactPage = () => {
  return (
    <section className="contact-grid-bg relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="float-slow absolute left-8 top-20 h-28 w-28 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="float-slow absolute bottom-16 right-10 h-32 w-32 rounded-full bg-emerald-400/12 blur-3xl [animation-delay:1.2s]" />
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="reveal-up mb-12 text-center sm:mb-14">
          <p className="mb-3 inline-block rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Contact
          </p>
          <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
            Get in Touch
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-300 sm:text-lg">
            Let&apos;s work together, say hi, or ask a question.
          </p>
        </div>

        <div className="reveal-up reveal-delay-1 rounded-2xl border border-gray-800/80 bg-gray-950/60 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_70px_-35px_rgba(16,185,129,0.45)] backdrop-blur-sm sm:p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Work with me
              </p>
              <p className="text-base text-gray-300 sm:text-lg">
                Whether you have a project idea, a question, or just want to
                connect, I&apos;d love to hear from you.
              </p>
              <div className="mt-6 hidden space-y-3 text-sm text-gray-400 md:block">
                <p>Clear communication.</p>
                <p>Practical solutions.</p>
                <p>Fast iteration.</p>
              </div>
            </div>

            <div className="md:col-span-8">
              <ContactForm />
            </div>
          </div>
        </div>

        <div className="reveal-up reveal-delay-2">
          <SocialLinks />
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
