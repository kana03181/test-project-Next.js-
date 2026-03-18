"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateCategoryRequestBody } from "@/app/api/admin/categories/route";
import CategoryForm from "@/app/admin/categories/_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function Page() {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) return;

    try {
      setIsSubmitting(true);

      const body: CreateCategoryRequestBody = { name }

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      })

      const { id } = await res.json();

      router.push(`/admin/categories/${id}`);
      alert("カテゴリーを作成しました");

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
          name={name}
          setName={setName}
          onSubmit={handleSubmit}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
