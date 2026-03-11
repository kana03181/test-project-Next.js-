"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UpdatePostRequestBody, PostShowResponse, Category } from "@/app/api/admin/posts/[id]/route";
import PostForm from "@/app/admin/posts/_components/PostForm";

export default function Page() {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const body:UpdatePostRequestBody = {title, content, thumbnailUrl, categories}

      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`);
      const { post }: { post: PostShowResponse["post"] } = await res.json();
      setTitle(post.title);
      setContent(post.content);
      setThumbnailUrl(post.thumbnailUrl);
      setCategories(post.postCategories.map((pc) =>pc.category ));
    };
    fetcher();
  }, [id]);


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
          thumbnailUrl={thumbnailUrl}
          setThumbnailUrl={setThumbnailUrl}
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
