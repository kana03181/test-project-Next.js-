"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import type { Post } from "@/app/_types/post";
// import type { MicroCmsPost } from "@/app/_types/MicroCmsPost";
import { PostShowResponse } from "@/app/api/posts/[id]/route";
import HomeStyles from "@/app/_styles/Home.module.css";

export default function Page() {
  const { id } = useParams<{id:string}>();
  const [post, setPost] = useState<PostShowResponse["post"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetcher = async () => {
      try {
        setLoading(true);
        setError(null)
        const res = await fetch(`/api/posts/${id}`);

        if (!res.ok) {
          throw new Error("記事の取得に失敗しました");
        }

        const data = await res.json();
        setPost(data.post);

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("不明なエラーです");
        }

      } finally {
        setLoading(false);
      }
    }
    fetcher();
  }, [id]);

  if (loading) {
    return (
      <div>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>エラー：{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <p>記事が見つかりません。</p>
      </div>
    );
  }

  return (

    <article className={HomeStyles.article}>
      <div className={HomeStyles.container}>
        <div className={HomeStyles.contentHeader}>
          <figure className={HomeStyles.thumbnail}>
            <Image
              width={1000}
              height={1000}
              src={post.thumbnailUrl}
              alt={post.title}
            />
          </figure>
        </div>
        <div className={HomeStyles.contentMain}>
          <div className={HomeStyles.header}>
            <p>{new Date(post.createdAt).toLocaleDateString("ja-JP", { year: "numeric", month: "numeric", day: "numeric" })}</p>
            <ul className={HomeStyles.tags}>
              {post.postCategories.map((category) => (
                <li className={HomeStyles.tagsCategory} key={category.category.id} >{category.category.name}</li>
              ))}
            </ul>
          </div>
          <div className={HomeStyles.main}>
            <h3 className={HomeStyles.title}>{post.title}</h3>
            <div>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
