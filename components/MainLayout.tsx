"use client";

import { signOut, useSession } from "next-auth/react";
import Header from "./Header";
import Navbar from "./Navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'] })

export default function MainLayout({ loggedIn, children, active, className }: { loggedIn: boolean, children: any, active: string, className?: string | undefined | null }): JSX.Element {
  const { data: session } = useSession();

  return <main className={"w-full " + className + " " + inter.className}>
    <Header loggedIn={loggedIn} userdata={session?.user} loginMode={!active.includes("/auth/signup")} />
    {loggedIn && <Navbar active={active} />}
    {children}
  </main>
}