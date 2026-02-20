import { Poppins } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import Header from "./Header";
// import { useProfileQuery } from "@/graphql/generated/schema";
import { useAuth } from "@/context/AuthContext";
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

  const { user, refreshMe } = useAuth();

  const body = document.body;
  
  refreshMe();

  if(router.pathname === "/") {
    body.classList.remove("group1", "group2", "group3", "md:staff-large");
    body.classList.add("home", "md:home-large");
  }  
  
  if(router.pathname === "/admin") {
    body.classList.remove("group1", "group2", "group3", "md:staff-large");
    body.classList.add("home", "md:home-large");
  } 
   
  if(router.pathname === "/staff") {
    body.classList.remove("home", "md:home-large");
    body.classList.add(`group${user?.group?.id}`, "md:staff-large");
  } 
  
  if(router.pathname === "/parent") {
    body.classList.add("home", "md:home-large");
  }
  
  if(router.pathname.startsWith("/profil")) {
    body.classList.add("home", "md:home-large");
  }  

  return (
    <>
      <Head>
        <title>{`BabyBoard - ${pageTitle}`}</title>
        <meta name="description" content="ads website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user && <Header user={user} />}
      <main className={` ${poppins.className} `}>
        {children}
      </main>
      {user && <Footer />}
    </>
  );
}
