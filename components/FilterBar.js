"use client";
import { MOIS } from "@/lib/constants";

const FILTRES_VIDES = { mois: "Tous", annee: "Tous", operation: "Tous", client: "Tous", ingenieur: "Tous", du: "", au: "" };

const LABELS_CHAMPS = {
  mois: "Mois",
  annee: "Année",
  operation: "Opération",
  client: "Client",
  ingenieur: "Ingénieur",
  du: "Du",
  au: "Au",
};

export default function FilterBar({ filtres, setFiltres, options }) {
  const { ingenieurs = [], operations = [], clients = [] } = options || {};
  const annees = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

  function update(champ, valeur) {
    setFiltres((f) => ({ ...f, [champ]: valeur }));
  }

  function retirer(champ) {
    update(champ, FILTRES_VIDES[champ]);
  }

  function reinitialiser() {
    setFiltres(FILTRES_VIDES);
  }

  const filtresActifs = Object.entries(filtres).filter(
    ([champ, valeur]) => valeur && valeur !== "Tous"
  );

  return (
    <div className="card p-4 mb-6 w-full">
      <div className="flex items-center justify-center gap-3 mb-3 relative">
        <p className="text-xs font-semibold text-ink/50 uppercase tracking-wide">Filtrer</p>
        {filtresActifs.length > 0 && (
          <button
            onClick={reinitialiser}
            className="absolute right-0 text-xs font-medium text-isoNavy hover:underline"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {filtresActifs.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {filtresActifs.map(([champ, valeur]) => (
            <button
              key={champ}
              onClick={() => retirer(champ)}
              className="badge bg-isoGreen-light text-isoGreen-dark hover:bg-isoRed/10 hover:text-isoRed transition-colors group"
              title="Retirer ce filtre"
            >
              <span className="text-ink/40 font-normal">{LABELS_CHAMPS[champ]}:</span> {valeur}
              <span className="ml-0.5 opacity-60 group-hover:opacity-100">✕</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-center">
        <Select label="Mois" value={filtres.mois} onChange={(v) => update("mois", v)} actif={filtres.mois !== "Tous"}>
          <option value="Tous">Tous</option>
          {MOIS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </Select>

        <Select label="Année" value={filtres.annee} onChange={(v) => update("annee", v)} actif={filtres.annee !== "Tous"}>
          <option value="Tous">Tous</option>
          {annees.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </Select>

        <Select label="Opération" value={filtres.operation} onChange={(v) => update("operation", v)} actif={filtres.operation !== "Tous"}>
          <option value="Tous">Tous</option>
          {operations.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </Select>

        <Select label="Client" value={filtres.client} onChange={(v) => update("client", v)} actif={filtres.client !== "Tous"}>
          <option value="Tous">Tous</option>
          {clients.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>

        <Select label="Ingénieur" value={filtres.ingenieur} onChange={(v) => update("ingenieur", v)} actif={filtres.ingenieur !== "Tous"}>
          <option value="Tous">Tous</option>
          {ingenieurs.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </Select>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink/50">Du</label>
          <input
            type="date"
            className={`border rounded-md px-2 py-1.5 text-sm ${filtres.du ? "border-isoGreen bg-isoGreen-light/40" : ""}`}
            value={filtres.du || ""}
            onChange={(e) => update("du", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink/50">Au</label>
          <input
            type="date"
            className={`border rounded-md px-2 py-1.5 text-sm ${filtres.au ? "border-isoGreen bg-isoGreen-light/40" : ""}`}
            value={filtres.au || ""}
            onChange={(e) => update("au", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, children, actif }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-ink/50">{label}</label>
      <select
        className={`border rounded-md px-2 py-1.5 text-sm min-w-[130px] ${
          actif ? "border-isoGreen bg-isoGreen-light/40 font-medium" : ""
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
    </div>
  );
}
