"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { ROLE_LABELS } from "@/lib/constants";
import RechercheGlobale from "@/components/RechercheGlobale";
import HorlogeDigitale from "@/components/HorlogeDigitale";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", roles: ["admin", "qualite"] },
  { href: "/mes-dossiers", label: "Mes dossiers", roles: ["ingenieur"] },
  { href: "/saisie", label: "Saisie", roles: ["admin", "qualite"] },
  { href: "/qualite", label: "Qualité", roles: ["admin", "qualite"] },
  { href: "/statistiques", label: "Statistiques", roles: ["admin", "qualite"] },
  { href: "/export", label: "Export", roles: ["admin", "qualite"] },
  { href: "/rapport", label: "Rapport", roles: ["admin", "qualite"] },
  { href: "/parametres", label: "Paramètres", roles: ["admin"] },
];

export default function Navbar({ role, nom, onChangerPersonne, masquerHorloge }) {
  const pathname = usePathname();
  const router = useRouter();
  const [enAttente, setEnAttente] = useState(null);
  const [menuOuvert, setMenuOuvert] = useState(false);

  useEffect(() => {
    if (!["admin", "qualite"].includes(role)) return;
    (async () => {
      const supabase = createClient();
      const { count } = await supabase
        .from("dossiers")
        .select("*", { count: "exact", head: true })
        .eq("etat", "En attente de vérification");
      setEnAttente(count ?? null);
    })();
  }, [role]);

  // Ferme le menu mobile à chaque changement de page
  useEffect(() => {
    setMenuOuvert(false);
  }, [pathname]);

  // Empêche le scroll du fond quand le panneau mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOuvert ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOuvert]);

  async function seDeconnecter() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const liensVisibles = LINKS.filter((l) => l.roles.includes(role));

  return (
    <>
      {["admin", "qualite"].includes(role) && (
        <img
          src="/logo-hillsolution.png"
          alt="Hill Solution"
          className="hidden xl:block fixed top-[104px] left-6 w-44 z-0"
        />
      )}
      <header className="border-b border-black/5 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 lg:h-24 gap-3 lg:gap-8">
          <div className="flex items-center gap-1 font-display font-bold text-lg shrink-0">
            <img src="/logo-hillsolution.png" alt="Hill Solution" className="h-11 lg:h-20 w-auto shrink-0" />
            <span className="whitespace-nowrap -ml-1 hidden sm:inline">Hill Solution</span>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {liensVisibles.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  pathname?.startsWith(l.href)
                    ? "bg-isoGreen-light text-isoGreen-dark"
                    : "text-ink/70 hover:bg-black/5"
                }`}
              >
                {l.label}
                {l.href === "/qualite" && !!enAttente && (
                  <span className="bg-isoRed text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[16px] text-center">
                    {enAttente}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex-1 lg:flex-none" />

          {["admin", "qualite"].includes(role) && (
            <div className="hidden md:block">
              <RechercheGlobale />
            </div>
          )}

          {/* Bloc utilisateur desktop */}
          <div className="hidden lg:flex items-center gap-3 text-sm">
            <span className="text-ink/60">{nom}</span>
            <span className="badge bg-isoNavy/10 text-isoNavy">{ROLE_LABELS[role]}</span>
            {onChangerPersonne && (
              <button onClick={onChangerPersonne} className="btn-secondary text-xs !py-1.5 !px-3">
                Changer de personne
              </button>
            )}
            <button onClick={seDeconnecter} className="btn-secondary text-xs !py-1.5 !px-3">
              Déconnexion
            </button>
            {!masquerHorloge && <HorlogeDigitale compact />}
          </div>

          {/* Badge d'alerte + bouton hamburger, mobile/tablette */}
          <div className="flex lg:hidden items-center gap-2">
            {!!enAttente && (
              <span className="bg-isoRed text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[16px] text-center">
                {enAttente}
              </span>
            )}
            <button
              onClick={() => setMenuOuvert((v) => !v)}
              aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOuvert}
              className="p-2 -mr-2 rounded-md hover:bg-black/5 flex flex-col justify-center items-center gap-1.5 w-10 h-10"
            >
              <span
                className={`block h-0.5 w-5 bg-ink transition-transform ${
                  menuOuvert ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span className={`block h-0.5 w-5 bg-ink transition-opacity ${menuOuvert ? "opacity-0" : ""}`} />
              <span
                className={`block h-0.5 w-5 bg-ink transition-transform ${
                  menuOuvert ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Panneau mobile */}
      {menuOuvert && (
        <div className="lg:hidden fixed inset-0 z-20" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMenuOuvert(false)} />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-black/5 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-3 flex items-center justify-between border-b border-black/5">
              <div className="text-sm">
                <span className="font-medium">{nom}</span>{" "}
                <span className="badge bg-isoNavy/10 text-isoNavy ml-1">{ROLE_LABELS[role]}</span>
              </div>
              {!masquerHorloge && <HorlogeDigitale compact />}
            </div>

            {["admin", "qualite"].includes(role) && (
              <div className="px-4 py-3 border-b border-black/5 md:hidden">
                <RechercheGlobale />
              </div>
            )}

            <nav className="flex flex-col p-2">
              {liensVisibles.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-3 rounded-md text-sm font-medium flex items-center justify-between ${
                    pathname?.startsWith(l.href)
                      ? "bg-isoGreen-light text-isoGreen-dark"
                      : "text-ink/70 active:bg-black/5"
                  }`}
                >
                  <span>{l.label}</span>
                  {l.href === "/qualite" && !!enAttente && (
                    <span className="bg-isoRed text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[16px] text-center">
                      {enAttente}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="p-3 border-t border-black/5 flex flex-col gap-2">
              {onChangerPersonne && (
                <button onClick={onChangerPersonne} className="btn-secondary text-sm w-full">
                  Changer de personne
                </button>
              )}
              <button onClick={seDeconnecter} className="btn-secondary text-sm w-full">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
