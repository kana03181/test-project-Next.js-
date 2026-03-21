"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UpdatePostRequestBody, PostShowResponse, Category } from "@/app/api/admin/posts/[id]/route";
import PostForm from "@/app/admin/posts/_components/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useFetch } from "@/app/_hooks/useFetch";

type FormValues = {
  title: string
  content: string
  thumbnailImageKey: string
  categories: Category[]
}

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();
  const [isSubmitting, setIsSubmitting] = useState(false);


  //更新
  const handleSubmit = async (data:FormValues) => {
    if (!token) return;

    try {
      setIsSubmitting(true);

      const body: UpdatePostRequestBody = {
        title: data.title,
        content: data.content,
        thumbnailImageKey: data.thumbnailImageKey,
        categories: data.categories
      }

      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error("更新に失敗しました");
      }

      alert("更新しました");
      router.push("/admin/posts");

    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("エラーが発生しました");
      }

    } finally {
      setIsSubmitting(false);
    }
  }

  //削除
  const handleDeletePost = async () => {
    if (!confirm("記事を削除しますか？")) return;
    if (!token) return;

    try {
      setIsSubmitting(true);

      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: {
        Authorization: token,
        },
      });

      if (!res.ok) {
        throw new Error("記事の削除に失敗しました");
      }

      alert("記事を削除しました");
      router.push("/admin/posts");

    } catch (err) {
      if (err instanceof Error) {
        alert("記事の削除に失敗しました");
      }

    } finally {
      setIsSubmitting(false);
    }
  }

  //記事取得
  const { data, error} = useFetch<PostShowResponse>(`/api/admin/posts/${id}`);
  const post = data?.post;

  if (error) return <div><p>エラー：{error instanceof Error ? error.message : "不明なエラー"}</p></div>
  if(!post) return <div><p>読み込み中...</p></div>


  const defaultValues:FormValues= {
    title: post?.title ?? "",
    content: post?.content ?? "",
    thumbnailImageKey: post?.thumbnailImageKey ?? "",
    categories: post?.postCategories?.map(
      (pc) => pc.category)?? [],
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">記事編集</h2>
      </div>
      <div>
        <PostForm
          mode="edit"
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onDelete={handleDeletePost}
          disabled={isSubmitting}
        />
      </div>
    </div>

  );
}
