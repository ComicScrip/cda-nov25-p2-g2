import Image from "next/image";

export default function Footer() {

  return (
    <footer className=" flex w-fit mx-auto h-fit justify-center">
      <Image src={"/home.png"} alt="" width={120} height={100} />
      <Image src={"/calendrier.png"} alt="" width={120} height={100} />
      <Image src={"/chat.png"} alt="" width={120} height={100} />
    </footer>
  );
}
