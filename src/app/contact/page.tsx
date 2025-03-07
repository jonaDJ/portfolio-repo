import React from "react";
import { ContactForm } from "@/components/ContactForm";
import { SocialLinks } from "@/components/SocialLinks";

const ContactPage = () => {
  return (
    <div className="flex justify-center items-center">
      <section className="flex flex-col items-center justify-center max-w-6xl pb-30 p-5 sm:pb-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold">Get in Touch</h2>
          <p className="mt-4 text-lg text-gray-300">
            Let's work together, say hi, or ask a question!
          </p>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <p className="text-gray-300 text-lg">
              Whether you have a project idea, a question, or just want to
              connect, I’d love to hear from you! Let's connect!
            </p>
          </div>

          <div className="w-full md:w-3/4">
            <ContactForm />
          </div>
        </div>
        <SocialLinks />
      </section>
    </div>
  );
};

export default ContactPage;
