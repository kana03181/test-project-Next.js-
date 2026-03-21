"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostForm from "@/app/admin/posts/_components/PostForm";
import { Category } from "@/app/api/admin/posts/[id]/route";
import { CreatePostRequestBody } from "@/app/api/admin/posts/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

type FormData = {
  title: string
  content: string
  thumbnailImageKey: string
  categories: Category[]
}

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleSubmit = async (data:FormData) => {
    if (!token) return;

    try {
      setIsSubmitting(true);

      const body: CreatePostRequestBody = {
        title: data.title,
        content: data.content,
        thumbnailImageKey: data.thumbnailImageKey,
        categories: data.categories
      };

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        throw new Error("記事の作成に失敗しました");
      }

      const { id } = await res.json();

      alert("記事を作成しました");
      router.push(`/admin/posts`)

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
          defaultValues={{
            title: "",
            content: "",
            thumbnailImageKey: "",
            categories: []
          }}
          mode="new"
          onSubmit={handleSubmit}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
