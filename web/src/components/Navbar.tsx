import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="bg-white p-4">
      <div className="container mx-auto flex justify-between gap-x-3">
        <div className="text-black text-2xl font-bold font-sans flex flex-row items-center">
          <div className="items-center"><Link href="/">Task Board</Link></div>
          <div className="pl-4">     <Image
        src="/task.png"
        alt="Logo"
        width={50}
        height={100}
      /></div>
         
        </div>
        <div className="space-x-4">
          {/* <Link href="/" className="text-white hover:text-gray-400">Home</Link>
          <Link href="/about" className="text-white hover:text-gray-400">About</Link>
          <Link href="/contact" className="text-white hover:text-gray-400">Contact</Link> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
