import Layout from "@/components/Layout";
import { useProfileQuery } from "@/graphql/generated/schema";
import ChildCard from "../../components/ChildCard";

export default function DashboardParents() {
  const parentQuery = useProfileQuery();

  if (parentQuery.loading) {
    return <div className="mx-auto max-w-sm px-6 py-8">Chargement…</div>;
  }

  if (parentQuery.error) {
    const msg = parentQuery.error?.message ?? "Erreur inconnue";
    return (
      <div className="mx-auto max-w-sm px-6 py-8">
        <p className="text-red-400">Erreur : {msg}</p>
      </div>
    );
  }

  const me = parentQuery.data?.me;
  if (me?.role !== "parent")
    return <div className="mx-auto max-w-sm px-6 py-8">Accès réservé aux parents.</div>;

  return (
    <Layout pageTitle="Accueil parent">
      <div className="mt-35 p-4 mb-6 w-full max-w-md rounded-2xl border-4 border-sky-300 bg-white/90 px-4 py-4 text-center shadow-[0_12px_30px_rgba(15,40,90,0.12)]">
        <h1 className="text-3xl font-extrabold tracking-wide text-blue-900">
          Bienvenue {me.first_name}
        </h1>
      </div>

      <div className="w-full max-w-md rounded-[28px] border-4 border-sky-300 bg-white/70 p-5 shadow-[0_14px_35px_rgba(15,40,90,0.12)]">
        <div className="space-y-4">
          {me.children?.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              onClick={() => console.log("ouvrir profil enfant", child)}
            />
          ))}

          {me.children?.length === 0 && (
            <p className="rounded-2xl bg-white/60 p-4 text-center text-blue-900/80">
              Aucun enfant renvoyé par l’API.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
