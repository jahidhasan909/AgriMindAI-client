import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1b2833]">
      <div className="relative animate-pulse">
        <Image
          src="https://i.ibb.co.com/RpY5p653/Screenshot-2026-07-18-at-10-35-00-PM-removebg-preview.png"
          alt="Brand Logo"
          width={180}
          height={60}
          priority
          className="h-auto w-auto object-contain"
        />
      </div>
    </div>
  );
}