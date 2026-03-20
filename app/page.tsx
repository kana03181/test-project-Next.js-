"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PostsIndexResponse } from "@/app/api/posts/route";
import HomeStyles from "@/app/_styles/Home.module.css";
import useSWR from 'swr'

export default function Page() {

  const [clamp, setClamp] = useState(true);

  const fetcher = async (url: string) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("記事の取得に失敗しました");
    }

    return res.json();

  };


  const {data, error, isLoading} = useSWR<PostsIndexResponse>("/api/posts", fetcher);

  if (isLoading) return <div><p>読み込み中...</p ></div>;
  if (error) return <div><p>エラー：{error instanceof Error ? error.message : "不明なエラー"}</p></div>

  const posts = data?.posts ?? [];

  return (
    <div>
      <main>
        <div className={HomeStyles.article}>
          {posts.map((post) =>
            <article className={HomeStyles.contents} key={post.id}>
              <Link href={`/posts/${post.id}`} >
                <div className={HomeStyles.inner}>
                  <div className={HomeStyles.header}>
                    <p className={HomeStyles.date}>{new Date(post.createdAt).toLocaleDateString("ja-JP", { year: "numeric", month: "numeric", day: "numeric" })}</p>
                    <ul className={HomeStyles.tags}>
                      {post.postCategories.map((category) => (
                        <li className={HomeStyles.tagsCategory} key={category.category.id} >{category.category.name}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={HomeStyles.main}>
                    <h3 className={HomeStyles.title}>{post.title}</h3>
                    <div className={`${HomeStyles.txt} ${!clamp ? HomeStyles.full : ""}`}
                      dangerouslySetInnerHTML={{ __html: post.content }}>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          )}
        </div>
      </main>
    </div>
  );
}
