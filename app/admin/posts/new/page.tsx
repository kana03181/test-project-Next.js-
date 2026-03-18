"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostForm from "@/app/admin/posts/_components/PostForm";
import { Category } from "@/app/api/admin/posts/[id]/route";
import { CreatePostRequestBody } from "@/app/api/admin/posts/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function Page() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter();
  const { token } = useSupabaseSession();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) return;

    try {
      setIsSubmitting(true);

      const body: CreatePostRequestBody = { title, content, thumbnailImageKey, categories };

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      })

      const { id } = await res.json();

      router.push(`/admin/posts/${id}`)
      alert("記事を作成しました");

    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }else {
        alert("記事の作成に失敗しました");
      }

    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">新規作成</h2>
      </div>
      <div>
        <PostForm
          mode="new"
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          thumbnailImageKey={thumbnailImageKey}
          setThumbnailImageKey={setThumbnailImageKey}
          categories={categories}
          setCategories={setCategories}
          onSubmit={handleSubmit}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
