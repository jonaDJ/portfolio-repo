"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  LucideLightbulb,
  LucideTarget,
  LucideMapPin,
  LucideRocket,
  LucideLaptop2,
} from "lucide-react";
import { SocialLinks } from "@/components/SocialLinks";
import { fetchDocumentById } from "@/lib/firebase";

interface AboutMeProps {
  name: string;
  title: string;
  avatarUrl: string;
  bio: string;
  expertise: string[];
  passions: string[];
  location: string;
  hobbies: string[];
  more: string[];
  techJourney: string[];
}

const AboutMe = () => {
  const [data, setData] = useState<AboutMeProps | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
        const blogData = await fetchDocumentById("about-me", "jon");
        setData(blogData as AboutMeProps);
        console.log(blogData);
      } catch (error) {
        console.error("Error fetching about me data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-full flex items-center justify-center pb-20 sm:p-4 sm:pb-8 flex-col">
      {loading && <div>loading...</div>}

      {data && (
        <>
          <div className="max-w-4xl w-full sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[95vh]">
              <div className="bg-gray-800 p-8 flex flex-col items-center justify-center">
                <Image
                  src={data.avatarUrl}
                  alt={data.name}
                  width={200}
                  height={200}
                  className="rounded-full mb-6 border-4 border-gray-700"
                />
                <h2 className="text-3xl font-semibold mb-2">{data.name}</h2>
                <p className="text-gray-400 text-lg mb-4">{data.title}</p>
                <div className="flex items-center">
                  <LucideMapPin className="w-5 h-5 mr-2 text-gray-500" />
                  <p className="text-gray-400">{data.location}</p>
                </div>
                <SocialLinks iconsOnly={true} />
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <LucideRocket className="w-6 h-6 mr-2" />
                    About
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{data.bio}</p>
                  <a
                    href="#additional-info"
                    className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors inline-block"
                  >
                    Learn More
                  </a>
                </div>

                {data.techJourney && data.techJourney.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold flex items-center gap-1 mb-4">
                      <LucideLaptop2 className="w-6 h-6" />
                      My Tech Journey
                    </h3>
                    <div className="relative">
                      {data.techJourney.map((item, index) => (
                        <div
                          key={item + index}
                          className="relative mb-4 sm:mb-8"
                        >
                          <div className="flex items-center">
                            <div className="z-10 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                {index + 1}
                              </span>
                            </div>
                            <div className=" ml-4">
                              <h4 className="text-md font-semibold text-gray-200">
                                {item}
                              </h4>
                            </div>
                          </div>
                          {index < data.techJourney.length - 1 && (
                            <div className="absolute top-10 left-3 sm:left-3.5 h-full w-0.5 bg-gray-700"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div id="additional-info" className="mt-8 max-w-4xl w-full p-4">
            <h3 className="text-xl font-semibold flex gap-3 mb-4">
              More About Me
            </h3>

            {data.more.length > 0 &&
              data.more?.map((item, index) => (
                <p
                  key={item + index}
                  className="text-gray-300 leading-relaxed my-4"
                >
                  {item}
                </p>
              ))}

            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap gap-2">
                {data.expertise.length > 0 &&
                  data.expertise.map((item, index) => (
                    <span
                      key={item + index}
                      className="bg-gray-700 text-gray-300 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <LucideLightbulb className="w-6 h-6 mr-2" />
                  Hobbies & Interests
                </h3>

                <div className="flex flex-wrap gap-2">
                  {data.hobbies.map((item, index) => (
                    <span
                      key={item + index}
                      className="bg-purple-700 text-purple-300 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <LucideTarget className="w-6 h-6 mr-2" />
                  Passions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.passions.length > 0 &&
                    data.passions?.map((item, index) => (
                      <span
                        key={item + index}
                        className="bg-indigo-700 text-indigo-300 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AboutMe;
