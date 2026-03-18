"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryShowResponse, UpdateCategoryRequestBody} from "@/app/api/admin/categories/[id]/route";
import CategoryForm from "@/app/admin/categories/_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function Page() {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  const { token } = useSupabaseSession();

  const handleSubmit = async(e:React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (!token) return;

    try {
      setIsSubmitting(true);

      const body: UpdateCategoryRequestBody = { name };

      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("更新に失敗しました");
      }
      alert("カテゴリーを更新しました");

      router.push("/admin/categories");

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
    if (!token) return;

    if (!confirm("カテゴリーを削除しますか？"))
      return;

    try {
      setIsSubmitting(true);

      await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        }
      })

      alert("カテゴリーを削除しました");

      router.push("/admin/categories");

    } catch (err) {
      if (err instanceof Error) {
        alert("カテゴリーの削除に失敗しました");
      }

    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!token) return;

    const fetcher = async() => {
      const res = await fetch(`/api/admin/categories/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        }
      });
      const { category }: CategoryShowResponse = await res.json();
      setName(category.name);
    }
    fetcher();
  }, [id, token]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">カテゴリー編集</h2>
      </div>
      <CategoryForm
        mode="edit"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
        disabled={isSubmitting}
      />
    </div>
  );
}
