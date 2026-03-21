"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PostShowResponse } from "@/app/api/posts/[id]/route";
import HomeStyles from "@/app/_styles/Home.module.css";
import { supabase } from "@/app/_libs/supabase";
import { useFetch } from "@/app/_hooks/useFetch";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  )

  const { data, error, isLoading } = useFetch<PostShowResponse>(`/api/posts/${id}`);
  const post = data?.post;

  // サムネイル取得
  useEffect(() => {
    if (!post?.thumbnailImageKey) return;

    const fetchThumbnail = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
          .getPublicUrl(post.thumbnailImageKey)

      // console.log(post.thumbnailImageKey);
      setThumbnailImageUrl(publicUrl)
    }
    fetchThumbnail();
  }, [post?.thumbnailImageKey])


  if(isLoading) return <div><p>読み込み中...</p></div>
  if (error) return <div><p>エラー：{error instanceof Error ? error.message : "不明なエラー"}</p></div>
  if (!post) return <div><p>記事が見つかりません。</p></div>

  return (

    <article className={HomeStyles.article}>
      <div className={HomeStyles.container}>
        <div className={HomeStyles.contentHeader}>
          {thumbnailImageUrl && (
            <figure className={HomeStyles.thumbnail}>
                <Image
                  width={1000}
                  height={1000}
                  src={thumbnailImageUrl}
                  alt="thumbnail"
                />
            </figure>
          )}
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
