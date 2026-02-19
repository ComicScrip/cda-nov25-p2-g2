import Layout from "@/components/Layout";
import { useChildrenQuery, useUserQuery } from "@/graphql/generated/schema";
import ChildCard from "../components/ChildCard";

export default function DashboardParents() {
  const parentQuery = useUserQuery();
  const childrenQuery = useChildrenQuery();

  if (parentQuery.loading || childrenQuery.loading)
    return <div className="mx-auto max-w-sm px-6 py-8">Chargement…</div>;

  if (parentQuery.error || childrenQuery.error) {
    const msg = parentQuery.error?.message ?? childrenQuery.error?.message ?? "Erreur inconnue";
    return (
      <div className="mx-auto max-w-sm px-6 py-8">
        <p className="text-red-400">Erreur : {msg}</p>
      </div>
    );
  }
  const me = parentQuery.data?.me;

  if (!me) {
    return <div className="mx-auto max-w-sm px-6 py-8">Non connecté.</div>;
  }

  if (me.role !== "parent") {
    return <div className="mx-auto max-w-sm px-6 py-8">Accès réservé aux parents.</div>;
  }

  const children = childrenQuery.data?.me?.children ?? [];

  return (
    <Layout>
      <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-sky-100 via-violet-100 to-emerald-100 px-4 pt-6 pb-24">
        <div className="mb-6 w-full max-w-md rounded-2xl border-4 border-sky-300 bg-white/90 px-4 py-4 text-center shadow-[0_12px_30px_rgba(15,40,90,0.12)]">
          <h1 className="text-3xl font-extrabold tracking-wide text-blue-900">
            Bienvenue {me.first_name}
          </h1>
        </div>

        <div className="w-full max-w-md rounded-[28px] border-4 border-sky-300 bg-white/70 p-5 shadow-[0_14px_35px_rgba(15,40,90,0.12)]">
          <div className="space-y-4">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                firstName={child.firstName}
                lastName={child.lastName}
                birthDate={child.birthDate}
                picture={child.picture}
                group={child.group?.name ?? ""}
                onClick={() => console.log("ouvrir profil enfant", child.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
