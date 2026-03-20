"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateCategoryRequestBody } from "@/app/api/admin/categories/route";
import CategoryForm from "@/app/admin/categories/_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleSubmit = async (data:{name: string}) => {
    if (!token) return;

    try {
      setIsSubmitting(true);

      const body: CreateCategoryRequestBody = { name: data.name }

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        throw new Error("カテゴリーの作成に失敗しました");
      }

      const { id } = await res.json();

      alert("カテゴリーを作成しました");
      router.push(`/admin/categories`);

    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("カテゴリーの作成に失敗しました");
      }

    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">カテゴリー作成</h2>
      </div>
      <div>
        <CategoryForm
          mode="new"
          onSubmit={handleSubmit}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
