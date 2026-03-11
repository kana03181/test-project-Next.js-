"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CategoriesIndexResponse } from "@/app/api/admin/categories/route";

export default function Page() {
  const [categories, setCategories] = useState<CategoriesIndexResponse["categories"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetcher = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/categories")

        if (!res.ok) {
          throw new Error("カテゴリーの取得に失敗しました");
        }

        const {categories} = await res.json();
        setCategories(categories);

      } catch (err) {
        if (err instanceof Error) {
          setError("不明なエラーです")
        }

      } finally {
        setLoading(false);
      }
    }
    fetcher()
  }, [])

  if(loading) return <div><p>読み込み中...</p></div>
  if (error) return <div><p>エラー：{error}</p></div>


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
