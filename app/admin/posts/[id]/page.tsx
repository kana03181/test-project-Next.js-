"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UpdatePostRequestBody, PostShowResponse, Category } from "@/app/api/admin/posts/[id]/route";
import PostForm from "@/app/admin/posts/_components/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function Page() {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  const { token } = useSupabaseSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) return;

    try {
      setIsSubmitting(true);

      const body:UpdatePostRequestBody = {title, content, thumbnailImageKey, categories}

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

  const handleDeletePost = async () => {
    if (!confirm("記事を削除しますか？"))
      return;

    try {
      setIsSubmitting(true);
      await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

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

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      });
      const { post }: { post: PostShowResponse["post"] } = await res.json();
      setTitle(post.title);
      setContent(post.content);
      setThumbnailImageKey(post.thumbnailImageKey);
      setCategories(post.postCategories.map((pc) =>pc.category ));
    };
    fetcher();
  }, [id, token]);


  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">記事編集</h2>
      </div>
      <div>
        <PostForm
          mode="edit"
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          thumbnailImageKey={thumbnailImageKey}
          setThumbnailImageKey={setThumbnailImageKey}
          categories={categories}
          setCategories={setCategories}
          onSubmit={handleSubmit}
          onDelete={handleDeletePost}
          disabled={isSubmitting}
        />
      </div>
    </div>

  );
}
