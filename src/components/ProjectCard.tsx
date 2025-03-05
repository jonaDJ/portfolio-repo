import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Github, Globe, Info, XCircle } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  id: number;
  image: string;
  title: string;
  description: string;
  demoLink: string | null;
  codeLink: string;
  cardId: number;
  setCardId: (id: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  image,
  title,
  description,
  demoLink,
  codeLink,
  cardId,
  setCardId,
}) => {
  const mainCardRef = useRef<HTMLDivElement>(null);
  const [mainCardHeight, setMainCardHeight] = useState<number | null>(null);

  useEffect(() => {
    if (mainCardRef.current) {
      setMainCardHeight(mainCardRef.current.offsetHeight);
    }
  }, [cardId]);

  return (
    <article className="w-full bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 transform hover:shadow-lg hover:scale-[1.01] cursor-pointer">
      <div
        className={`relative ${
          cardId === id ? "rotate-y-180" : "rotate-y-0"
        } transition-transform duration-500`}
      >
        {cardId === id ? (
          // Description Card (Back)
          <div
            className={`w-full h-full bg-gray-900 rounded-lg px-2 py-2 transition-opacity transform rotate-y-180 duration-500 flex flex-col`}
            style={{
              height: mainCardHeight ? `${mainCardHeight}px` : "auto",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setCardId(-1);
            }}
          >
            <button
              className="absolute self-end mb-3 text-gray-50 hover:text-gray-200 "
              aria-label="Close description"
            >
              <XCircle size={24} className="text-gray-50 hover:text-gray-400" />
            </button>
            <div className="flex-grow flex items-center justify-center">
              <p className="text-md text-center">{description}</p>
            </div>
          </div>
        ) : (
          // Main Card (Front)
          <div
            onClick={(e) => {
              e.stopPropagation();
              setCardId(id);
            }}
            ref={mainCardRef}
            className={`w-full h-full bg-gray-900 rounded-lg overflow-hidden transition-opacity duration-300`}
          >
            <div className="px-1 py-2 flex flex-col">
              <div className="relative aspect-[3/2] w-full mb-2">
                <Image
                  src={image}
                  alt={title}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-col px-2">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <button
                    className="transition-transform  hover:scale-110 focus:text-white"
                    aria-label="View description"
                  >
                    <Info
                      size={20}
                      className="text-gray-50 hover:text-gray-400"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    {demoLink && (
                      <Link
                        href={demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-400 transition-colors"
                        aria-label={`Live demo of ${title}`}
                      >
                        <Globe size={18} aria-hidden="true" />
                        <span className="text-md">Demo</span>
                      </Link>
                    )}
                    <Link
                      href={codeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-purple-500 hover:text-purple-400 transition-colors"
                      aria-label={`View code of ${title} on GitHub`}
                    >
                      <Github size={18} aria-hidden="true" />
                      <span className="text-md">Code</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
