'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="w-full h-10 bg-[#97da9bff] flex justify-between items-center relative">
        {/* Hamburger Menu */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col space-y-1 ml-4 p-2">
          <div className="w-6 h-0.5 bg-black"></div>
          <div className="w-6 h-0.5 bg-black"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </button>
        {/* Title */}
        <div className="text-Black font-bold text-3xl">Eagle Eyed Scholar</div>
        {/* Home Logo */}
        <Link href="/">
          <Image
            src="/homelogot.png"
            alt="Home Page logo"
            width={35}
            height={40}
            className="mr-4"
          />
        </Link>
      </div>
      {menuOpen && (
        <div className="absolute top-10 left-0 bg-white shadow-lg border w-48 z-10">
          <ul className="py-2">
            <li className="hover:bg-gray-100">
              <Link href="/" className="block px-4 py-2">Home</Link>
            </li>
            <li className="hover:bg-gray-100">
              <Link href="/form" className="block px-4 py-2">Form</Link>
            </li>
          </ul>
        </div>
      )}
      <div className="w-full h-0.5 bg-black"></div>
    </>
  );
}