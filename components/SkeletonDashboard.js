"use client";

function Pulse({ className = "" }) {
  return <div className={`animate-pulse bg-black/[0.06] rounded-lg ${className}`} />;
}

export default function SkeletonDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" aria-busy="true" aria-label="Chargement du tableau de bord">
      {/* Filtres */}
      <div className="flex justify-center mb-6">
        <Pulse className="h-24 w-full max-w-3xl" />
      </div>

      {/* Bande logo + KPI */}
      <div className="card p-6 mb-6 flex flex-col md:flex-row gap-6">
        <Pulse className="h-32 md:w-56 shrink-0" />
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Pulse key={i} className="h-20" />
          ))}
        </div>
      </div>

      {/* Onglets opération */}
      <Pulse className="h-10 w-full mb-6" />

      {/* Boutons graphiques */}
      <div className="flex gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Pulse key={i} className="h-9 w-36" />
        ))}
      </div>

      <Pulse className="h-24 w-full mb-6" />
      <Pulse className="h-48 w-full mb-6" />
      <Pulse className="h-64 w-full mb-6" />

      <div className="grid md:grid-cols-2 gap-6">
        <Pulse className="h-56" />
        <Pulse className="h-56" />
      </div>
    </div>
  );
}
