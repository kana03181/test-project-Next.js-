"use client";

import Link from "next/link";
import React from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useRouter } from 'next/navigation';
import { supabase } from "@/app/_libs/supabase";
import HeaderStyle from "@/app/_styles/Header.module.css";

export const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut()
    await router.replace("/")
  }

  const { session, isLoading } = useSupabaseSession();

  return (
    <header className={HeaderStyle.header}>
      <div className={HeaderStyle.headerInner}>
        <div className={HeaderStyle.logo}>
          <Link href="/" className={HeaderStyle.logoLink}><h1>Blog</h1></Link>
        </div>
        {!isLoading && (
          <nav className={HeaderStyle.nav}>
            <div className={HeaderStyle.navInner}>
              <ul className={HeaderStyle.navList}>
                {session ? (
                  <>
                    <li className={HeaderStyle.navListItem}>
                      <Link href="/admin" className={HeaderStyle.navListLink}>管理画面</Link>
                    </li>
                    <button onClick={handleLogout} className={HeaderStyle.navListLink}>ログアウト</button>
                  </>
                ) : (
                <>
                <li className={HeaderStyle.navListItem}>
                  <Link href="/contact" className={HeaderStyle.navListLink}>お問い合わせ</Link>
                </li>
                <li className={HeaderStyle.navListItem}>
                  <Link href="/sign_in" className={HeaderStyle.navListLink}>ログイン</Link>
                </li>
                </>
              )}
              </ul>
            </div>
            </nav>
          )}
      </div>
    </header>
  );
}
