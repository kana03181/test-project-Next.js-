"use client";

import Link from "next/link";
import HeaderStyle from "@/app/_styles/Header.module.css";

export default function Header() {
  return (
    <header className={HeaderStyle.header}>
      <div className={HeaderStyle.headerInner}>
        <div className={HeaderStyle.logo}>
          <Link href="/" className={HeaderStyle.logoLink}><h1>Blog</h1></Link>
        </div>
        <nav className={HeaderStyle.nav}>
          <div className={HeaderStyle.navInner}>
            <ul className={HeaderStyle.navList}>
              <li className={HeaderStyle.navListItem}>
                <Link href="/contact" className={HeaderStyle.navListLink}>お問い合わせ</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
