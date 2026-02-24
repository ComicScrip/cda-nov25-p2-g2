import Image from "next/image";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/chateau.png"
        alt="Admin background"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-white/20" />
      <div className="relative mx-auto w-full max-w-[430px] px-4 pb-28 pt-4">{children}</div>
    </main>
  );
}
