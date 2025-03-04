import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
}

const HeroCard: React.FC<HeroCardProps> = ({
  title,
  description,
  image,
  href,
}) => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = () => {
    setIsContentVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setIsContentVisible(false);
    }, 1000);
  };

  return (
    <Link href={href} passHref>
      <div
        className="relative w-full h-80 sm:h-96 rounded-lg overflow-hidden shadow-lg group focus:outline-none focus:ring focus:ring-blue-300"
        onTouchStart={handleTouchStart}
      >
        <div className="relative w-full h-full">
          <Image
            src={image}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div
          className={`absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white text-center transition-opacity duration-300 p-4
                      ${
                        isContentVisible || "opacity-0 group-hover:opacity-100"
                      }`}
        >
          <h3 className="text-xl sm:text-2xl font-bold">{title}</h3>
          <p className="text-xs sm:text-sm mt-2">{description}</p>

          <span
            className="mt-4 flex items-center gap-2 px-4 py-2 border border-white bg-white text-black rounded-full text-sm font-medium 
                       transition-all duration-300 hover:bg-black hover:text-white focus:ring focus:ring-blue-300 cursor-pointer"
          >
            Read More <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HeroCard;
