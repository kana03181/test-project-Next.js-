"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostForm from "@/app/admin/posts/_components/PostForm";
import { Category } from "@/app/api/admin/posts/[id]/route";
import { CreatePostRequestBody } from "@/app/api/admin/posts/route";

export default function Page() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(
    "https://placehold.jp/800x400.png",
  );
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const body: CreatePostRequestBody = { title, content, thumbnailUrl, categories };

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          thumbnailUrl={thumbnailUrl}
          setThumbnailUrl={setThumbnailUrl}
          categories={categories}
          setCategories={setCategories}
          onSubmit={handleSubmit}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
