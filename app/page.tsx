"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Post } from "@/app/_types/post";
import HomeStyles from "@/app/_styles/Home.module.css";
// import posts from '././_data/posts';

export default function Page() {

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clamp, setClamp] = useState<boolean>(true);

  useEffect(() => {
    const fetcher =  async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/`);
        // console.log(res);


        if (!res.ok) {
          throw new Error("記事の取得に失敗しました");
        }

        const {posts} = await res.json();
        setPosts(posts);

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
                        <li className={HomeStyles.tagsCategory} key={category} >{category}</li>
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
