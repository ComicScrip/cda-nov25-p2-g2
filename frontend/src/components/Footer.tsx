import Link from "next/link";
import { useRouter } from "next/router";
import home from "@public/home.png"
import calendar from "@public/calendrier.png";
import chat from "@public/chat.png";

export default function Footer() {  
    const router = useRouter();
    return( 
      <footer className="flex w-fit mx-auto h-fit justify-center">
        <img src={home.src} alt="" className="w-30 h-25" />
        <img src={calendar.src} alt="" className="w-30 h-25" />
        <img src={chat.src} alt="" className="w-30 h-25" /> 
      </footer>
    );
}  

