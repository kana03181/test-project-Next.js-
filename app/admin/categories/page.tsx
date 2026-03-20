"use client";

import Link from "next/link";
import { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from 'swr'

export default function Page() {
  const { token } = useSupabaseSession();

  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      }
    })

    if (!res.ok) {
      throw new Error("カテゴリーの取得に失敗しました");
    }

    return res.json();
  }

  const { data, error, isLoading } = useSWR<CategoriesIndexResponse>(
    token ? "/api/admin/categories" : null,
    fetcher
  );

  if(isLoading) return <div><p>読み込み中...</p></div>
  if (error) return <div><p>エラー：{error instanceof Error ? error.message : "不明なエラー"}</p></div>

  const categories = data?.categories ?? [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-16">
          <h2 className="text-xl font-bold">カテゴリー一覧</h2>
          <Link href={`/admin/categories/new`} className="px-4 py-2 rounded hover:bg-blue-400 text-white bg-blue-500">
            <p className="font-bold">新規作成</p>
          </Link>
      </div>
      <div>
        <ul>
          {categories.map((category) =>
            <li key={category.id} className="p-4 border-b-2 border-solid border-gray-300">
              <Link href={`/admin/categories/${category.id}`}><p className="font-bold">{category.name}</p></Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
