import Link from "next/link";
import { useRouter } from "next/router";

export default function Footer() {  
    const router = useRouter();
    return( 
      <footer className="absolute bottom-0 left-0 right-0 flex w-fit mx-auto h-fit justify-center">
        <img src="home.png" alt="" className="w-30 h-25" />
        <img src="calendrier.png" alt="" className="w-30 h-25" />
        <img src="chat.png" alt="" className="w-30 h-25" /> 
      </footer>
    );
}  

