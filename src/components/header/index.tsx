"use client";

import Link from 'next/link';
import { FiUser, FiLogOut, FiLoader, FiLock } from 'react-icons/fi';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function Header() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => update(), 1000 * 60 * 5); // Atualiza a cada 5 minutos
    return () => clearInterval(interval);
  }, [update]);

  async function handleLogin() {
    router.push('/login');
  }

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push('/login')
    router.refresh();
  }

  const isReallyAuthenticated = status === "authenticated" && session !== null;

  return (
    <header className="w-full flex items-center px-2 py-4 bg-white h-20 shadow-sm">
      <div className="w-full flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/">
          <h1 className="font-bold text-green-600 text-2xl pl-1 hover:tracking-widest duration-300">
            SuperSign
          </h1>
        </Link>

        {status === "loading" ? (
          <FiLoader size={26} color="#4b5563" className="animate-spin" />
        ) : isReallyAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <FiUser size={26} color="#4b5563" className="cursor-pointer hover:text-green-600 transition" />
            </Link>

            <button onClick={handleLogout} className="hover:scale-110 transition">
              <FiLogOut size={26} color="#ff2313" />
            </button>
          </div>
        ) : (
          <button onClick={handleLogin} className="hover:scale-110 transition">
            <FiLock size={26} color="#4b5563" />
          </button>
        )}
      </div>
    </header>
  );
}