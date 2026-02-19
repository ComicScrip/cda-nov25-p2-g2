import Layout from "@/components/Layout";
import { useChildrenQuery, useUserQuery } from "@/graphql/generated/schema";
import ChildCard from "../components/ChildCard";

export default function DashboardParents() {
  const parentQuery = useUserQuery();
  const childrenQuery = useChildrenQuery(); // doit renvoyer me { children { id } }

  if (parentQuery.loading || childrenQuery.loading) {
    return <div className="mx-auto max-w-sm px-6 py-8">Chargement…</div>;
  }

  if (parentQuery.error || childrenQuery.error) {
    const msg = parentQuery.error?.message ?? childrenQuery.error?.message ?? "Erreur inconnue";
    return (
      <div className="mx-auto max-w-sm px-6 py-8">
        <p className="text-red-400">Erreur : {msg}</p>
      </div>
    );
  }

  const me = parentQuery.data?.me;
  if (!me) return <div className="mx-auto max-w-sm px-6 py-8">Non connecté.</div>;
  if (me.role !== "parent")
    return <div className="mx-auto max-w-sm px-6 py-8">Accès réservé aux parents.</div>;

  const childIds = (childrenQuery.data?.me?.children ?? []).map((c) => c.id);

  return (
    <Layout pageTitle="Accueil parent">
      <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-sky-100 via-violet-100 to-emerald-100 px-4 pt-6 pb-24">
        <div className="mb-6 w-full max-w-md rounded-2xl border-4 border-sky-300 bg-white/90 px-4 py-4 text-center shadow-[0_12px_30px_rgba(15,40,90,0.12)]">
          <h1 className="text-3xl font-extrabold tracking-wide text-blue-900">
            Bienvenue {me.first_name}
          </h1>
        </div>

        <div className="w-full max-w-md rounded-[28px] border-4 border-sky-300 bg-white/70 p-5 shadow-[0_14px_35px_rgba(15,40,90,0.12)]">
          <div className="space-y-4">
            {childIds.map((id) => (
              <ChildCard
                key={id}
                childId={id}
                onClick={() => console.log("ouvrir profil enfant", id)}
              />
            ))}

            {childIds.length === 0 && (
              <p className="rounded-2xl bg-white/60 p-4 text-center text-blue-900/80">
                Aucun enfant renvoyé par l’API.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
