import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

const Loading = ({
  size = "md",
  text = "Loading...",
  fullScreen = false,
}: LoadingProps) => {
  const sizeClasses = {
    sm: "h-8 w-8 border-t-2 border-b-2",
    md: "h-12 w-12 border-t-2 border-b-2",
    lg: "h-16 w-16 border-t-4 border-b-4",
  };

  const containerClasses = fullScreen
    ? "flex flex-col items-center justify-center h-screen"
    : "flex flex-col items-center justify-center";

  return (
    <div className={containerClasses}>
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-indigo-500`}
      ></div>
      {text && <p className="mt-2 text-gray-400">{text}</p>}
    </div>
  );
};

export default Loading;
