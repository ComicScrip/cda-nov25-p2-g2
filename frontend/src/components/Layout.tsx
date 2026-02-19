import { Poppins } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import Header from "./Header";
import { useProfileQuery } from "@/graphql/generated/schema";
import Footer from "./Footer";

const poppins = Poppins({
  display: "auto",
  weight: ['100', '200', '300','400','500', '600', '700', '800', '900']
});

interface LayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export default function Layout({ children, pageTitle }: LayoutProps) {
  const router = useRouter();

  const { data } = useProfileQuery({
    fetchPolicy: "cache-and-network",
  });
  const user = data?.me || null;
  
  // On utilise .includes pour être sûr de capter /profil même avec des sous-pages
  const isProfilPage = router.pathname.includes("/profil");
  const isHomePage = router.pathname === "/";

  // On cache si c'est l'un ou l'autre
  const shouldHideHeader = isHomePage || isProfilPage;

  return (
    <>
      <Head>
        <title>{`BabyBoard - ${pageTitle}`}</title>
        <meta name="description" content="ads website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user && <Header user={user} />}
      <main className={`${poppins.className} 
        ${(router.pathname === "/" && "home md:home-large" )}
        ${(router.pathname === "/admin" && "home md:home-large" )}
        ${(router.pathname === "/staff" && `group${user?.group?.id} md:staff-large` )}
        ${(router.pathname === "/parent" && "home md:home-large" )} `} >
        {children}
      </main>
      {user && <Footer />}

      {/* {!shouldHideHeader && <Header />} */}

    </>
  );
}
