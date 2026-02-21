"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import type { Post } from "@/app/_types/post";
import type { MicroCmsPost } from "@/app/_types/MicroCmsPost";
import HomeStyles from "@/app/_styles/Home.module.css";

export default function Page() {

  const [posts, setPosts] = useState<MicroCmsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clamp, setClamp] = useState(true);

  useEffect(() => {
    const fetcher =  async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://nextapp.microcms.io/api/v1/posts", {
          headers: {
            "X-MICROCMS-API-KEY" : process.env.NEXT_PUBLIC_MICROCMSCMS_API_KEY as string,
          }
        });
        // console.log(res);


        if (!res.ok) {
          throw new Error("記事の取得に失敗しました");
        }

        const {contents} = await res.json();
        setPosts(contents);

      } catch (err) {
        if (err instanceof Error) {
          setError("不明なエラーです")
        }
      } finally {
        setLoading(false);
      }
    }

    fetcher();
  }, []);

  if (loading) return <div><p>読み込み中...</p ></div>;
  if (error) return <div><p>エラー：{error}</p ></div>;

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
                      {post.categories.map((category) => (
                        <li className={HomeStyles.tagsCategory} key={category.id} >{category.name}</li>
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
