import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { useAdminCountsQuery } from "@/graphql/generated/schema";
import { useAuth } from "@/hooks/CurrentProfile";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const { data, loading: countsLoading } = useAdminCountsQuery({
    fetchPolicy: "network-only",
  });

  const counts = data?.adminCounts;

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/");
    else if (!isAdmin) router.replace("/403");
  }, [loading, user, isAdmin, router]);

  if (loading) return null;
  if (!user || !isAdmin) return null;

  return (
    <Layout pageTitle="admin dashboard">
      <div className="flex items-center justify-between">
        <Image src="/babyboardlogo.png" alt="logo" width={150} height={40} priority />

        <div className="flex items-center gap-3">
          <Image src="/admin/cloche.png" alt="Notification" width={28} height={28} />

          <div className="h-10 w-10 overflow-hidden rounded-full bg-white/80 shadow-sm border border-white">
            <Image src="/admin/avatarfille.png" alt="Admin avatar" width={40} height={40} />
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[620px]">
        <p className="mt-6 text-center text-[14px] font-semibold">
          Bonjour {user?.first_name ?? "Admin"},
        </p>

        <div className="mt-3 grid grid-cols-3 gap-4">
          <button
            className="
    flex items-center gap-3
    border-2 border-(--color-primary)
    bg-white/80
    rounded-2xl
    px-2 py-2
    shadow-sm
    transition-all duration-200
    hover:shadow-md
    hover:scale-[1.03]
    active:scale-95
    focus:outline-none
  "
            onClick={() => router.push("/admin/childrenHistory")}
          >
            <img src="/admin/bbavatar.png" className="w-16 h-16 object-contain" alt="Enfants" />
            <div className="text-left">
              <div className="text-[18px]">
                {countsLoading ? "..." : (counts?.childrenCount ?? 0)}
              </div>
              <div className="text-[12px]">Enfants</div>
            </div>
          </button>

          <button
            className="
    flex items-center gap-3
    border-2 border-(--color-primary)
    bg-white/80
    rounded-2xl
    px-2 py-2
    shadow-sm
    transition-all duration-200
    hover:shadow-md
    hover:scale-[1.03]
    active:scale-95
    focus:outline-none
  "
            onClick={() => router.push("/admin/staff")}
          >
            <img src="/admin/staffavatar.png" className="w-16 h-16 object-contain" />
            <div className="text-left">
              <div className="text-[18px]">{countsLoading ? "..." : (counts?.staffCount ?? 0)}</div>
              <div className="text-[12px]">Staff</div>
            </div>
          </button>

          <button
            className="
    flex items-center gap-3
    border-2 border-(--color-primary)
    bg-white/80
    rounded-2xl
    px-2 py-2
    shadow-sm
    transition-all duration-200
    hover:shadow-md
    hover:scale-[1.03]
    active:scale-95
    focus:outline-none
  "
            onClick={() => router.push("/admin/parents")}
          >
            <img src="/admin/parentavatar.png" className="w-16 h-16 object-contain" />
            <div className="text-left">
              <div className="text-[18px]">
                {countsLoading ? "..." : (counts?.parentCount ?? 0)}
              </div>
              <div className="text-[12px]">Parents</div>
            </div>
          </button>
        </div>

        {/* Gestion */}
        <div className="mt-7">
          <p className="text-[12px] font-semibold">Gestion</p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Enfant */}
            <button className="relative w-full h-[85px] rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-4 py-3 shadow-sm">
              <span
                className="
    absolute -top-2 -right-2
    h-6 w-6
    rounded-full
    bg-white/80
    border-2 border-(--color-primary)
    flex items-center justify-center
    text-[14px]
    shadow-sm
  "
              >
                +
              </span>
              <div className="flex items-center gap-3 h-full">
                <div className="h-10 w-10 flex items-center justify-center">
                  <img
                    src="/admin/bbavatar.png"
                    className="w-16 h-16 object-contain"
                    alt="Enfants"
                  />
                </div>
                <div className="text-left text-[12px] leading-tight">
                  Ajouter <br /> un enfant
                </div>
              </div>
            </button>

            {/* Staff */}
            <button className="relative w-full h-[85px] rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-4 py-3 shadow-sm">
              <span
                className="
    absolute -top-2 -right-2
    h-6 w-6
    rounded-full
    bg-white/80
    border-2 border-(--color-primary)
    flex items-center justify-center
    text-[14px] font-bold text-slate-500
    shadow-sm
  "
              >
                +
              </span>
              <div className="flex items-center gap-3 h-full">
                <div className="h-10 w-10 flex items-center justify-center">
                  <img src="/admin/staffavatar.png" className="w-16 h-16 object-contain" />
                </div>
                <div className="text-left text-[12px] leading-tight">
                  Ajouter <br /> un membre <br /> du staff
                </div>
              </div>
            </button>

            {/* Parent */}
            <div className="col-span-2 flex justify-center">
              <div className="w-[50%]">
                <button className="relative w-full h-[85px] rounded-2xl bg-white/70 border-2 border-[#BFE7FF] px-4 py-3 shadow-sm">
                  <span
                    className="
    absolute -top-2 -right-2
    h-6 w-6
    rounded-full
    bg-white/80
    border-2 border-(--color-primary)
    flex items-center justify-center
    text-[14px] font-bold text-slate-500
    shadow-sm
  "
                  >
                    +
                  </span>
                  <div className="flex items-center gap-3 h-full">
                    <div className="h-10 w-10 flex items-center justify-center">
                      <img src="/admin/parentavatar.png" className="w-16 h-16 object-contain" />
                    </div>
                    <div className="text-left text-[12px] leading-tight">
                      Ajouter <br /> un parent
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Suivi */}
        <div className="mt-7">
          <p className="text-[12px] font-semibold">Suivi</p>
          <button className="mt-4 w-full rounded-2xl bg-white/80 py-3 text-[13px]  shadow-sm border-2 border-(--color-primary)">
            Voir tous les rapport
          </button>
        </div>
      </div>
    </Layout>
  );
}
