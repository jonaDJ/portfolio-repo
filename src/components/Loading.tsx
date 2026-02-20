import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
  accent?: "indigo" | "red" | "blue" | "orange" | "cyan";
}

const Loading = ({
  size = "md",
  text = "Loading...",
  fullScreen = false,
  accent = "indigo",
}: LoadingProps) => {
  const sizeClasses = {
    sm: "h-8 w-8 border-t-2 border-b-2",
    md: "h-12 w-12 border-t-2 border-b-2",
    lg: "h-16 w-16 border-t-4 border-b-4",
  };

  const accentClasses = {
    indigo: "border-indigo-500",
    red: "border-red-500",
    blue: "border-blue-500",
    orange: "border-orange-500",
    cyan: "border-cyan-400",
  };

  const containerClasses = fullScreen
    ? "flex min-h-[100dvh] w-full flex-col items-center justify-center"
    : "flex flex-col items-center justify-center";

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} ${accentClasses[accent]}`}
      ></div>
      {text && <p className="mt-2 text-gray-400">{text}</p>}
    </div>
  );
};

export default Loading;
