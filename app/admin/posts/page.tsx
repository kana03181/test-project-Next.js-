"use client";

import Link from "next/link";
import { PostsIndexResponse } from "@/app/api/posts/route";
// import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useFetch } from "@/app/_hooks/useFetch";

export default function Page() {

  const {data, error, isLoading} = useFetch<PostsIndexResponse>("/api/admin/posts");

  if(isLoading) return <div><p>読み込み中...</p></div>
  if (error) return <div><p>エラー：{error instanceof Error ? error.message : "不明なエラー"}</p></div>

  const posts = data?.posts ?? [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-16">
        <h2 className="text-xl font-bold">記事一覧</h2>
        <Link href={`/admin/posts/new`} className="px-4 py-2 rounded hover:bg-blue-400 text-white bg-blue-500">
          <p className="font-bold">新規作成</p>
        </Link>
      </div>
      <div>
        <ul>
          {posts.map((post) =>
            <li key={post.id} className="p-4 border-b-2 border-solid border-gray-300">
              <Link href={`/admin/posts/${post.id}`}>
                <p className="font-bold">{post.title}</p>
                <p>{new Date(post.createdAt).toLocaleDateString("ja-JP", {year:"numeric", month:"numeric", day:"numeric"})}</p>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
