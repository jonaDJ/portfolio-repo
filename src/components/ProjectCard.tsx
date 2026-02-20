"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { CalendarDays, ExternalLink, Github, X } from "lucide-react";

interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  demoLink: string | null;
  codeLink: string;
  date: string;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const PREVIEW_LENGTH = 165;

const ProjectCard: React.FC<ProjectCardProps> = ({
  image,
  title,
  description,
  demoLink,
  codeLink,
  date,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const dialogTitleId = useId();
  const isTruncated = description.length > PREVIEW_LENGTH;
  const previewText = isTruncated
    ? `${description.slice(0, PREVIEW_LENGTH).trimEnd()}...`
    : description;

  const openModal = () => {
    if (document.activeElement instanceof HTMLElement) {
      lastFocusedRef.current = document.activeElement;
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dialogNode = dialogRef.current;

    const getFocusableElements = () => {
      if (!dialogNode) {
        return [] as HTMLElement[];
      }

      return Array.from(
        dialogNode.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      );
    };

    const focusInitialElement = () => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
        return;
      }

      dialogNode?.focus();
    };

    requestAnimationFrame(focusInitialElement);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusableElements();
      if (focusable.length === 0) {
        event.preventDefault();
        dialogNode?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const onFocusIn = (event: FocusEvent) => {
      if (!dialogNode || dialogNode.contains(event.target as Node)) {
        return;
      }

      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        dialogNode.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      lastFocusedRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    const appScrollContainer = document.getElementById("app-scroll-container");

    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    const originalContainerOverflow = appScrollContainer?.style.overflow;
    const originalContainerTouch = appScrollContainer?.style.touchAction;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    if (appScrollContainer) {
      appScrollContainer.style.overflow = "hidden";
      appScrollContainer.style.touchAction = "none";
    }

    const preventDefault = (event: Event) => event.preventDefault();
    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventDefault as EventListener);
      window.removeEventListener("touchmove", preventDefault as EventListener);

      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;

      if (appScrollContainer) {
        appScrollContainer.style.overflow = originalContainerOverflow || "";
        appScrollContainer.style.touchAction = originalContainerTouch || "";
      }
    };
  }, [isOpen]);

  return (
    <>
      <article
        className="group relative h-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/70 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/50 hover:shadow-[0_18px_45px_-30px_rgba(249,115,22,0.55)]"
      >
        <button
          type="button"
          onClick={openModal}
          aria-label={`Open details for ${title}`}
          aria-haspopup="dialog"
          className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
        >
          <span className="sr-only">Open details for {title}</span>
        </button>

        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/15 to-transparent" />
        </div>

        <div className="relative z-20 flex flex-col p-4 sm:p-5 pointer-events-none">
          <div className="mb-2 flex items-center gap-2 text-xs text-orange-200/90">
            <CalendarDays size={14} aria-hidden="true" />
            <span>{formatDate(date)}</span>
          </div>

          <h3
            className="min-h-[3.5rem] text-left text-lg font-semibold text-white"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </h3>

          <p className="mt-2 min-h-[6.75rem] text-sm leading-relaxed text-gray-300">
            {previewText}
            {isTruncated && (
              <>
                {" "}
                <button
                  type="button"
                  onClick={openModal}
                  className="pointer-events-auto font-medium text-orange-300 transition hover:text-orange-200 hover:underline"
                >
                  continue...
                </button>
              </>
            )}
          </p>

          <div
            className={`mt-4 grid gap-2 ${
              demoLink ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            {demoLink && (
              <a
                href={demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-orange-400/55 bg-orange-500/10 px-3 py-2 text-sm font-medium text-orange-200 transition hover:border-orange-300/70 hover:bg-orange-500/20"
                aria-label={`Open live demo for ${title}`}
              >
                <ExternalLink size={16} aria-hidden="true" />
                <span>Demo</span>
              </a>
            )}

            <a
              href={codeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800/80 px-3 py-2 text-sm font-medium text-gray-200 transition hover:border-gray-500 hover:bg-gray-800"
              aria-label={`Open source code for ${title}`}
            >
              <Github size={16} aria-hidden="true" />
              <span>Code</span>
            </a>
          </div>
        </div>
      </article>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[70] grid place-items-center p-4 sm:p-6">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close project details"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={dialogTitleId}
              tabIndex={-1}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-gray-700 bg-gray-950 shadow-[0_30px_90px_-40px_rgba(249,115,22,0.55)]"
            >
              <div className="relative h-44 w-full sm:h-56">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
              </div>

              <div className="max-h-[calc(90vh-11rem)] overflow-y-auto p-5 sm:max-h-[calc(90vh-14rem)] sm:p-6">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 id={dialogTitleId} className="text-2xl font-semibold text-white">
                    {title}
                  </h3>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close modal"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 bg-gray-900 text-gray-300 transition hover:border-gray-500 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mb-4 flex items-center gap-2 text-sm text-orange-200/90">
                  <CalendarDays size={15} aria-hidden="true" />
                  <span>{formatDate(date)}</span>
                </div>

                <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
                  {description}
                </p>

                <div
                  className={`mt-5 grid gap-2 ${
                    demoLink ? "grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {demoLink && (
                    <a
                      href={demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-orange-400/55 bg-orange-500/10 px-3 py-2.5 text-sm font-medium text-orange-200 transition hover:border-orange-300/70 hover:bg-orange-500/20"
                    >
                      <ExternalLink size={16} aria-hidden="true" />
                      <span>Open Demo</span>
                    </a>
                  )}

                  <a
                    href={codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800/80 px-3 py-2.5 text-sm font-medium text-gray-200 transition hover:border-gray-500 hover:bg-gray-800"
                  >
                    <Github size={16} aria-hidden="true" />
                    <span>Open Code</span>
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ProjectCard;
