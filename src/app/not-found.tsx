import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1b2833] p-4 text-white">
      <div className="flex flex-col items-center justify-center text-center backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
  
        <Image
          src="https://i.ibb.co.com/RpY5p653/Screenshot-2026-07-18-at-10-35-00-PM-removebg-preview.png"
          alt="Brand Logo"
          width={180}
          height={60}
          priority
          className="h-auto w-auto object-contain mb-6"
        />

        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-gray-300 mb-6">Page Not Found</p>

        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/20 text-sm font-medium"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}