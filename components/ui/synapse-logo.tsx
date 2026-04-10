import { cn } from "@/lib/utils";

interface SynapseLogoProps {
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

export function SynapseLogo({
  className,
  showWordmark = true,
  wordmarkClassName,
}: SynapseLogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
      >
        <defs>
          <radialGradient id="nodeGrad1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </radialGradient>
          <radialGradient id="nodeGrad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0891b2" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Connection lines */}
        <path
          d="M10 17 Q17 9 24 17"
          stroke="url(#nodeGrad1)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.9"
          filter="url(#glow)"
        />
        <path
          d="M10 17 Q17 25 24 17"
          stroke="url(#nodeGrad2)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
          filter="url(#glow)"
        />
        {/* Nodes */}
        <circle cx="10" cy="17" r="5" fill="url(#nodeGrad1)" filter="url(#glow)" />
        <circle cx="24" cy="17" r="5" fill="url(#nodeGrad2)" filter="url(#glow)" />
        {/* Center dot */}
        <circle cx="17" cy="17" r="2" fill="white" opacity="0.9" />
      </svg>
      {showWordmark && (
        <span
          className={cn(
            "text-lg font-bold tracking-tight text-white",
            wordmarkClassName
          )}
        >
          Synapse
        </span>
      )}
    </div>
  );
}
