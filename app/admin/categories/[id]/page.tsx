"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryShowResponse, UpdateCategoryRequestBody} from "@/app/api/admin/categories/[id]/route";
import CategoryForm from "@/app/admin/categories/_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from "swr";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  //更新
  const handleSubmit = async(data:{ name:string }) => {
    if (!token) return;

    try {
      setIsSubmitting(true);

      const body: UpdateCategoryRequestBody = { name:data.name };

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

  //削除
  const handleDeletePost = async () => {
    if (!token) return;

    if (!confirm("カテゴリーを削除しますか？")) return;

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

  //カテゴリー取得
    const fetcher = async(url: string) => {
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        }
      });

      if (!res.ok) {
        throw new Error("カテゴリーの取得に失敗しました");
      }

      return res.json();
    }

  const { data, error, isLoading } = useSWR<CategoryShowResponse>(
    token && id ? `/api/admin/categories/${id}` : null,
    fetcher
  );

  if(isLoading) return <div><p>読み込み中...</p></div>
  if (error) return <div><p>エラー：{error instanceof Error ? error.message : "不明なエラー"}</p></div>

  const category = data?.category;
  const defaultValue = category?.name ?? "";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">カテゴリー編集</h2>
      </div>
      <CategoryForm
        mode="edit"
        defaultValue={defaultValue}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
        disabled={isSubmitting}
      />
    </div>
  );
}
