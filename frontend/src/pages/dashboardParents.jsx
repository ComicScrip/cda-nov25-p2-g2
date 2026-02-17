import ChildCard from "../components/ChildCard";

const parent = {
  firstname: "Omaya",
};

const children = [
  {
    id: 1,
    name: "Ichem BATTOUR",
    age: "9 mois",
    group: "Groupe Jaune",
    photo: "/avatar/enfant.png",
  },
];

export default function DashboardParents() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-sky-100 via-violet-100 to-emerald-100 px-4 pt-6 pb-24">
      {/* BIENVENUE */}
      <div className="mb-6 w-full max-w-md rounded-2xl border-4 border-sky-200 bg-white/90 px-4 py-4 text-center shadow-[0_12px_30px_rgba(15,40,90,0.12)]">
        <h1 className="text-3xl font-extrabold tracking-wide text-blue-900">
          Bienvenue {parent.firstname}
        </h1>
      </div>

      {/* CARD PRINCIPALE */}
      <div className="w-full max-w-md rounded-[28px] border-4 border-sky-300 bg-white/70 p-5 shadow-[0_14px_35px_rgba(15,40,90,0.12)]">
        {/* Liste des enfants */}
        <div className="space-y-4">
          {children.map((child) => (
            <ChildCard
              key={child.id}
              name={child.name}
              age={child.age}
              group={child.group}
              photo={child.photo}
              onClick={() => console.log("ouvrir profil enfant", child.id)}
            />
          ))}
        </div>

        {/* Bouton Ajouter */}
        <button
          type="button"
          className="mt-6 flex w-full items-center gap-4 rounded-3xl p-2 text-left transition hover:scale-[1.02] active:scale-95"
        >
          {/* Zone gauche (empilement des ronds) */}
          <div className="relative h-24 w-24">
            {/* Grand rond rose derrière */}
            <div className="absolute inset-0 rounded-full bg-pink-200/60 shadow-[0_14px_28px_rgba(255,160,200,0.35)]" />

            {/* Petit rond + AU-DESSUS */}
            <div className="absolute left-3 top-3 z-10 h-18 w-18 rounded-full bg-gradient-to-b from-pink-200 to-violet-200 p-[6px] shadow-[0_14px_28px_rgba(180,80,180,0.20)]">
              <div className="h-full w-full overflow-hidden rounded-full bg-white/35 backdrop-blur">
                {/** biome-ignore lint/performance/noImgElement: <explanation> */}
                <img
                  src="/boutons/plus.png"
                  alt="Ajouter un enfant"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Texte */}
          <div className="flex-1 rounded-3xl bg-pink-100/70 px-5 py-6 shadow-[0_10px_16px_rgba(20,40,90,0.06)]">
            <span className="text-lg font-semibold text-blue-900/90">Ajouter un enfant</span>
          </div>
        </button>
      </div>
    </div>
  );
}
