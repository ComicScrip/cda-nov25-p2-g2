import { useRouter } from "next/router";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className=" flex w-fit mx-auto h-fit justify-center">
      {/* On utilise directement le chemin vers le dossier public avec / */}
      <img src={"/home.png"} alt="" width={120} height={100} />
      <img src={"/calendrier.png"} alt="" width={120} height={100} />
      <img src={"/chat.png"} alt="" width={120} height={100} />
    </footer>
  );
}
