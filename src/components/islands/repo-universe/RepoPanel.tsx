import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Repo } from "../../../data/repos";

interface RepoPanelProps {
  repo: Repo | null;
  onClose: () => void;
}

export default function RepoPanel({ repo, onClose }: RepoPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!repo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => panelRef.current?.querySelector("a")?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [repo, onClose]);

  return (
    <AnimatePresence>
      {repo && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${repo.name} details`}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 h-full w-full cursor-pointer bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            className="relative w-full max-w-lg border border-gridline bg-panel/80 backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.94, y: 14, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: 8, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <div className="pointer-events-none absolute left-0 top-0 h-3.5 w-3.5 border-l-2 border-t-2 border-trace" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-3.5 w-3.5 border-b-2 border-r-2 border-trace" />
            <button
              type="button"
              aria-label="Close panel"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center border border-gridline text-text-secondary transition-colors hover:border-trace hover:text-trace"
              onClick={onClose}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6">
              <p className="silkscreen text-trace">{repo.language}</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-text-primary">{repo.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{repo.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {repo.topics.map((t) => (
                  <span key={t} className="silkscreen border border-gridline px-2 py-1 text-text-secondary">
                    {t}
                  </span>
                ))}
              </div>

              <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-gridline pt-5">
                <div>
                  <dt className="silkscreen text-text-secondary">STARS</dt>
                  <dd className="mt-1 font-display text-lg text-text-primary">{repo.stars}</dd>
                </div>
                <div>
                  <dt className="silkscreen text-text-secondary">FORKS</dt>
                  <dd className="mt-1 font-display text-lg text-text-primary">{repo.forks}</dd>
                </div>
                <div>
                  <dt className="silkscreen text-text-secondary">UPDATED</dt>
                  <dd className="mt-1 font-mono text-xs text-text-primary">{repo.updatedAt}</dd>
                </div>
              </dl>

              <a
                href={repo.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 border border-trace/40 px-5 py-3 font-mono text-sm text-trace no-underline transition-colors hover:bg-trace/10"
              >
                View on GitHub
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
