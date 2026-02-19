import { Poppins } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import Header from "./Header";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface LayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export default function Layout({ children, pageTitle }: LayoutProps) {
  const router = useRouter();

  // On utilise .includes pour être sûr de capter /profil même avec des sous-pages
  const isProfilPage = router.pathname.includes("/profil");
  const isHomePage = router.pathname === "/";

  // On cache si c'est l'un ou l'autre
  const shouldHideHeader = isHomePage || isProfilPage;

  return (
    <>
      <Head>
        <title>{`P2 Template - ${pageTitle}`}</title>
        <meta name="description" content="ads website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Condition renforcée */}
      {!shouldHideHeader && <Header />}

      <main className={`${poppins.variable} ${isHomePage ? "home" : "bg-amber-50"}`}>
        {children}
      </main>
    </>
  );
}
