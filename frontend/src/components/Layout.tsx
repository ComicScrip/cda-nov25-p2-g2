import Head from "next/head";
import type { ReactNode } from "react";
import Header from "./Header";
import { useRouter } from "next/router";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});


interface LayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export default function Layout({ children, pageTitle }: LayoutProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{`P2 Template - ${pageTitle}`}</title>
        <meta name="description" content="ads website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      { router.pathname !== "/" && <Header />}
      <main className={`${poppins.variable} ${(router.pathname === "/" ? "home" : "bg-amber-50")}`}>{children}</main>
    </>
  );
}
