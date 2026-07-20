'use client'
import React from "react";
import Link from "next/link";

import { FaFacebook, FaFacebookSquare, FaGithub, FaLink, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { usePathname } from "next/navigation";


const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525 0h3.08c.072 1.482.68 2.85 1.7 3.869 1.019 1.018 2.387 1.626 3.869 1.698V8.65c-1.876-.051-3.616-.682-5.02-1.748v7.242c0 4.1-3.328 7.425-7.426 7.425-4.1 0-7.425-3.325-7.425-7.425 0-4.1 3.325-7.425 7.425-7.425.43 0 .852.037 1.263.108V10.1c-.413-.108-.838-.163-1.263-.163-2.28 0-4.125 1.845-4.125 4.125s1.845 4.125 4.125 4.125 4.125-1.845 4.125-4.125V0z" />
  </svg>
);

const Footer: React.FC = () => {

const pathname = usePathname();
    if (pathname.includes('dashboard') || pathname.includes('login') || pathname.includes('registration')) {
        return null;
    }




  return (
    <footer className="w-full bg-black text-white pt-12 pb-0 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Hero Banner */}
        <div className="relative w-full h-[320px] md:h-[380px] rounded-[2.5rem] overflow-hidden border border-neutral-800 flex items-center px-8 md:px-16 shadow-2xl">
          
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop"
            alt="Farming Banner"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          {/* Banner Content */}
          <div className="relative z-10 max-w-xl space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Fresh Food Starts With <br /> Better Farming
            </h2>
            <p className="text-sm md:text-base text-neutral-200 font-normal max-w-md">
              Experience premium farm-fresh products grown with innovation, sustainability, and care.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/marketplace"
                className="bg-white text-black font-semibold text-xs md:text-sm px-6 py-3 rounded-full hover:bg-neutral-200 transition-all duration-300 shadow-md"
              >
                Fresh Products
              </Link>
             
            </div>
          </div>
        </div>

        {/* Brand & Socials Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-4">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2.5">
              <div className="">
                {/* Logo Icon */}
              
              </div>
              <span className="text-xl font-extrabold tracking-wider text-white uppercase">
                AgriMind AI
              </span>
            </div>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-normal">
              Smart farming meets sustainable agriculture. We grow fresh, high-quality produce using modern technology, responsible farming practices, and a commitment to transparency.
            </p>
          </div>

             

          {/* Social Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="https://www.linkedin.com/in/jahid--hasan"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              <FaLinkedin className="w-3.5 h-3.5" />
              <span>Linkedin</span>
            </Link>
            <Link
              href="https://github.com/jahidhasan909"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              <FaGithub className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </Link>
           
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4 pb-8 border-t border-neutral-900">
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="#technology" className="hover:text-white transition-colors">Our Technology</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide">Services</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><Link href="#services#precision-farming" className="hover:text-white transition-colors">Precision Farming</Link></li>
              <li><Link href="#services#smart-irrigation" className="hover:text-white transition-colors">Smart Irrigation</Link></li>
              <li><Link href="#services#drone-surveying" className="hover:text-white transition-colors">Drone Surveying</Link></li>
              <li><Link href="#services#crop-monitoring" className="hover:text-white transition-colors">Crop Monitoring</Link></li>
              <li><Link href="#services#field-mapping" className="hover:text-white transition-colors">Field Mapping</Link></li>
              <li><Link href="#services#farm-analytics" className="hover:text-white transition-colors">Farm Analytics</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide">Company</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About AgriPulse</Link></li>
              <li><Link href="#case-studies" className="hover:text-white transition-colors">Case Studies</Link></li>
              <li><Link href="#testimonials" className="hover:text-white transition-colors">Testimonials</Link></li>
              <li><Link href="#careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide">Contact Info</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>New York, USA</li>
              <li>+1 234 567 890</li>
              <li>09:00 AM – 06:00 PM</li>
              <li className="pt-1">
                <a href="mailto:support@agripulse.com" className="hover:text-white transition-colors">
                  support@agrimindai.com
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Large Bottom Typography Watermark */}
      <div className="w-full text-center select-none pt-6 pointer-events-none">
        <h1 className="text-[12vw] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-neutral-800 via-neutral-900 to-black tracking-widest uppercase scale-y-110">
          AgriMindAI
        </h1>
      </div>
    </footer>
  );
};

export default Footer;