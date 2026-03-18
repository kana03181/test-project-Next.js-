"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouteGuard } from "@/app/admin/_hooks/useRouteGuard";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  useRouteGuard();

  const pathname = usePathname();
  const isSelected = (href: string) => {
    return pathname.includes(href)
  }

  return (
    <div className="flex items-start justify-between">
      <aside className="bg-gray-100 w-[20%] sticky top-0 left-0 h-dvh">
        <ul>
          <li>
            <Link href="/admin/posts" className={`block ${isSelected("/admin/posts") && "bg-blue-100"}`}>
              <p className="text-xl font-bold p-6">記事一覧</p>
            </Link>
          </li>
          <li>
            <Link href="/admin/categories" className={`block ${isSelected("/admin/categories") && "bg-blue-100"}`}>
              <p className="text-xl font-bold px-6 py-4">カテゴリー一覧</p>
            </Link>
          </li>
        </ul>
      </aside>
      <main className="w-[80%]">
        {children}
      </main>
    </div>
  )
}
