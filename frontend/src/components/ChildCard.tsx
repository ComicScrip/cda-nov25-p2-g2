import type React from "react";
import { useChildByIdQuery } from "@/graphql/generated/schema";

type Props = {
  childId: number;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function ChildCard({ childId, onClick }: Props) {
  const { data, loading, error } = useChildByIdQuery({
    variables: { id: childId },
  });

  if (loading) {
    return (
      <div className="flex w-full items-center gap-4 rounded-3xl p-2">
        <div className="h-24 w-24 rounded-full bg-white/60" />
        <div className="flex-1 rounded-3xl bg-white/60 px-5 py-8" />
      </div>
    );
  }

  if (error || !data?.child) {
    return (
      <div className="w-full rounded-3xl bg-white/70 p-4 text-blue-900/80">
        Impossible de charger l’enfant #{childId}.
      </div>
    );
  }

  const child = data.child;
  const birth = new Date(child.birthDate).toLocaleDateString("fr-FR");

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-3xl p-2 text-left transition hover:scale-[1.02] active:scale-95"
    >
      <div className="h-24 w-24 rounded-full bg-gradient-to-b from-yellow-200 to-yellow-300 p-[6px] shadow-[0_14px_25px_rgba(255,200,60,0.25)]">
        {/** biome-ignore lint/performance/noImgElement: <explanation> */}
        <img
          src={child.picture}
          alt={`${child.firstName} ${child.lastName}`}
          className="h-full w-full rounded-full border-4 border-white/90 object-cover"
        />
      </div>

      <div className="flex-1 rounded-3xl bg-yellow-100/80 px-5 py-4 shadow-[0_10px_16px_rgba(20,40,90,0.06)]">
        <p className="text-lg font-extrabold text-blue-900">
          {child.firstName} {child.lastName}
        </p>

        <p className="text-base font-medium text-blue-900/90">{birth}</p>

        <p className="text-base font-medium text-blue-900/90">{child.group?.name ?? ""}</p>
      </div>
    </button>
  );
}
