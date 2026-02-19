import Layout from "@/components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { type LoginInput, useLoginMutation } from "@/graphql/generated/schema";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const [login] = useLoginMutation();
  const { refreshMe } = useAuth();

  const { register, getValues } = useForm<LoginInput>();

  const handleLogin = async () => {
    await login({ variables: { data: getValues() } });

    const me = await refreshMe();
    if (!me) return;

    if (me.role === "admin") router.push("/admin");
    else if (me.role === "staff") router.push("/staff");
    else router.push("/parent");
  };

  return (
    <Layout pageTitle="Accueil">
      <img src="/babyboardlogo.png" className="md:w-[40%] md:m-auto md:max-w-[600px]"/>
      <div className="p-4 max-w-[400px] mx-auto mt-15 md:max-w-[600px] md:mt-0">
      <form className="flex flex-col items-center text-[#1b3c79] md:relative md:bottom-10">
        <input type="email" placeholder="Email" {...register("email")}
          className="text-xl text-center bg-[#d4efff] rounded-4xl px-2 py-3 w-[75%] mb-2 md:text-4xl md:rounded-[50] md:py-6 md:mb-6" />
        <input type="password" placeholder="Mot de passe" {...register("password")}
          className="text-xl text-center bg-[#d4efff] rounded-4xl px-2 py-3 w-[75%] mb-0 md:text-4xl md:rounded-[50] md:py-6" />
        <Link href="/" className="hover:underline">
          <p className="text-[16px] md:text-2xl">Mot de passe oublié ?</p>
        </Link>

        <input
          type="button"
          value="Se connecter"
          onClick={handleLogin}
          className="text-xl text-center bg-[#d4efff] rounded-4xl px-2 py-3 w-[65%] mt-18 mb-2 border-2 border-transparent hover:cursor-pointer hover:border-2 hover:border-[#88D3FF] md:text-4xl md:rounded-[50] md:py-5 md:w-[75%]"
        />

        <p className="text-[16px] md:text-2xl">Besoin d'aide ? <Link href="/" className="hover:underline">Contact crèche</Link></p>
      </form>
      </div>
    </Layout>
  );
}
