import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAllChildrenQuery,
  useCreateParentMutation,
  useLinkParentToChildMutation,
} from "@/graphql/generated/schema";

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export default function AddParentModal({ open, onClose }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  const [createParent] = useCreateParentMutation();
  const [linkParentToChild] = useLinkParentToChildMutation();
  const { data: childrenData } = useAllChildrenQuery();

  const [success, setSuccess] = useState(false);

  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedChildIds, setSelectedChildIds] = useState<number[]>([]);

  const onSubmit = async (values: FormValues) => {
    // a faire : supprimer, quand le stysteme de mail sera en place
    const tempPassword = crypto.randomUUID().replace(/-/g, "").slice(0, 12) + "A1!";
    // crypto.randomUUID()          → "a3f8c2d1-9b4e-4f7a-8c2d-1b3e5f7a9c2d"
    //.replace(/-/g, "")           → "a3f8c2d19b4e4f7a8c2d1b3e5f7a9c2d"
    //.slice(0, 12)                → "a3f8c2d19b4e"   (12 chars minuscules + chiffres)
    //+ "A1!"                      → "a3f8c2d19b4eA1!"  valide
    const result = await createParent({
      variables: {
        data: { ...values, password: tempPassword, role: "parent", group_id: null },
      },
    });

    const newParentId = result.data?.createUser.id;
    if (!newParentId) return;
    for (const child of childrenData?.children ?? []) {
      if (selectedChildIds.includes(child.id)) {
        const existingParentIds = child.parents.map((p) => ({ id: p.id }));
        await linkParentToChild({
          variables: {
            id: child.id,
            data: { parents: [...existingParentIds, { id: newParentId }] },
          },
        });
      }
    }
    console.log("Create parent:", values);

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSearch("");
      setDropdownOpen(false);
      reset();
      onClose();
    }, 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]
"
        onClick={onClose}
        aria-label="Fermer la modal"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[400px] rounded-3xl bg-[#FEF9F6] border-2 border-(--color-secondary) p-5 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-10">
          <Image
            src="/boutons/plus.png"
            alt="Ajouter"
            width={80}
            height={80}
            className="rounded-full"
          />
          <h2 className="text-[16px] font-semibold">Ajouter un parent</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
          <p className="text-[13px] font-medium">Informations</p>

          {/* Prénom / Nom */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="first_name" className="text-[12px] font-medium">
                Prénom*
              </label>
              <input
                id="first_name"
                {...register("first_name", { required: "Champ requis" })}
                className={`w-full rounded-xl border-2 bg-white px-2 py-1 text-[13px] outline-none ${errors.first_name ? "border-red-400" : "border-(--color-primary)"}`}
              />
              {errors.first_name && <p className="text-[11px] text-red-500">{errors.first_name.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="last_name" className="text-[12px] font-medium">
                Nom*
              </label>
              <input
                id="last_name"
                {...register("last_name", { required: "Champ requis" })}
                className={`w-full rounded-xl border-2 bg-white px-2 py-1 text-[13px] outline-none ${errors.last_name ? "border-red-400" : "border-(--color-primary)"}`}
              />
              {errors.last_name && <p className="text-[11px] text-red-500">{errors.last_name.message}</p>}
            </div>
          </div>

          {/* Adresse mail */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-[12px] font-medium">
              Adresse mail*
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Champ requis" })}
              className={`w-full rounded-xl border-2 bg-white px-2 py-1 text-[13px] outline-none ${errors.email ? "border-red-400" : "border-(--color-primary)"}`}
            />
            {errors.email && <p className="text-[11px] text-red-500">{errors.email.message}</p>}
          </div>

          {/* Téléphone */}
          <div className="space-y-1">
            <label htmlFor="phone" className="text-[12px] font-medium">
              Téléphone*
            </label>
            <input
              id="phone"
              {...register("phone", { required: "Champ requis" })}
              className={`w-full rounded-xl border-2 bg-white px-2 py-1 text-[13px] outline-none ${errors.phone ? "border-red-400" : "border-(--color-primary)"}`}
            />
            {errors.phone && <p className="text-[11px] text-red-500">{errors.phone.message}</p>}
          </div>
          {/* Enfants liés */}
          <div>
            <p className="text-[13px] font-medium mb-1">Enfants liés</p>

            {/* Bouton */}
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-full rounded-xl border-2 border-(--color-primary) bg-white px-3 py-1.5 text-[12px] text-left outline-none flex justify-between items-center"
            >
              <span className="text-gray-400">
                {selectedChildIds.length === 0
                  ? "+ Ajouter un enfant"
                  : `${selectedChildIds.length} enfant(s) sélectionné(s)`}
              </span>
              <span
                className={`transition-transform duration-200 text-gray-400 ${dropdownOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>

            {/* Accordéon */}
            {dropdownOpen && (
              <div className="mt-1 rounded-xl border-2 border-(--color-primary) bg-white overflow-hidden">
                {/* Recherche */}
                <div className="p-2 border-b border-gray-100">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-2 py-1 text-[12px] outline-none"
                  />
                </div>
                {/* Liste scrollable */}
                <div className="max-h-24 overflow-y-auto">
                  {childrenData?.children
                    .filter((child) =>
                      `${child.firstName} ${child.lastName}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    )
                    .map((child) => (
                      <label
                        key={child.id}
                        className="flex items-center gap-2 px-3 py-2 text-[12px] hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedChildIds.includes(child.id)}
                          onChange={(e) =>
                            setSelectedChildIds((prev) =>
                              e.target.checked
                                ? [...prev, child.id]
                                : prev.filter((id) => id !== child.id),
                            )
                          }
                        />
                        {child.firstName} {child.lastName}
                      </label>
                    ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {selectedChildIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-h-[60px] overflow-y-auto">
                {childrenData?.children
                  .filter((child) => selectedChildIds.includes(child.id))
                  .map((child) => (
                    <span
                      key={child.id}
                      className="flex items-center gap-1 rounded-full bg-white border border-(--color-secondary) px-2 py-0.5 text-[11px]"
                    >
                      {child.firstName} {child.lastName}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedChildIds((prev) => prev.filter((id) => id !== child.id))
                        }
                        className="hover:opacity-60"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>
          {success && (
            <p className="text-center text-[12px] text-green-600 font-medium py-1">
              ✓ Parent créé avec succès !
            </p>
          )}

          {/* Buttons */}
          <div className="mt-2 flex justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-1 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-1 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
            >
              Créer parent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
