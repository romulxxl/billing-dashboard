const testimonials = [
  {
    quote: "Synapse replaced 4 different tools we were paying for. The dashboard is so clean our non-technical stakeholders actually use it now.",
    name: "Sarah Chen",
    role: "Head of Product, Acme Corp",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=2563eb&color=fff&size=80",
    accent: "#3b82f6",
  },
  {
    quote: "We track 200M events a month through Synapse. It has never gone down. The alert system alone has saved us from 3 potential outages.",
    name: "Marcus Webb",
    role: "CTO, Globex Industries",
    avatar: "https://ui-avatars.com/api/?name=Marcus+Webb&background=0891b2&color=fff&size=80",
    accent: "#22d3ee",
  },
  {
    quote: "Onboarding took 20 minutes. We were tracking real events by lunch. The developer docs are the best I've ever read.",
    name: "Priya Nair",
    role: "Senior Engineer, Initech",
    avatar: "https://ui-avatars.com/api/?name=Priya+Nair&background=4f46e5&color=fff&size=80",
    accent: "#818cf8",
  },
];

export function Testimonials() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #071224 0%, #0a1931 100%)" }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(37,99,235,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-400">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Loved by engineering teams
          </h2>
          <p className="mt-4 text-lg" style={{ color: "#475569" }}>
            Join thousands of teams that ship faster with Synapse.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map(({ quote, name, role, avatar, accent }) => (
            <div
              key={name}
              className="relative rounded-2xl p-6"
              style={{
                background: "rgba(10,25,49,0.7)",
                border: `1px solid ${accent}25`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 0 40px ${accent}10`,
              }}
            >
              {/* Quote mark */}
              <div
                className="mb-4 text-5xl font-serif leading-none select-none"
                style={{ color: accent, opacity: 0.4 }}
              >
                &ldquo;
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#93c5fd" }}>
                {quote}
              </p>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatar}
                  alt={name}
                  className="h-10 w-10 rounded-full"
                  style={{ outline: `2px solid ${accent}40`, outlineOffset: "2px" }}
                />
                <div>
                  <p className="font-semibold text-sm text-white">{name}</p>
                  <p className="text-xs" style={{ color: "#475569" }}>{role}</p>
                </div>
              </div>

              {/* Bottom glow */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accent}60, transparent)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
