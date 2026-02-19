import Link from "next/link";
import { useRouter } from "next/router";

export default function Footer() {  
    const router = useRouter();
    return( 
      <footer className="absolute bottom-0 flex w-full mx-auto gap-1 justify-center">
        <img src="home.png" alt="" className="w-30 h-25" />
        <img src="calendrier.png" alt="" className="w-40 h-30" />
        <img src="chat.png" alt="" className="w-30 h-25" />
      </footer>
    );
}  

