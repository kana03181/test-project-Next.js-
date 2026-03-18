
import { Category } from "@/app/api/admin/posts/[id]/route";
import CategoriesSelect from "@/app/admin/posts/_components/CategoriesSelect"
import Label from "@/app/_components/Label"
import { supabase } from "@/app/_libs/supabase";
import { v4 as uuidv4 } from "uuid";
import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";

type Props = {
  mode: "new" | "edit"
  title: string
  setTitle:(title: string) => void
  content: string
  setContent: (content: string) => void
  thumbnailImageKey: string
  setThumbnailImageKey: (thumbnailImageKey: string) => void
  categories: Category[]
  setCategories: (categories: Category[]) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onDelete?: () => void
  disabled: boolean
}

export default function PostForm({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailImageKey,
  setThumbnailImageKey,
  categories,
  setCategories,
  onSubmit,
  onDelete,
  disabled
}: Props) {

  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  )

  // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
  useEffect(() => {
    if (!thumbnailImageKey) return;

    const fetcher = async () => {
      const {
        data:{ publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }
    fetcher();
  }, [thumbnailImageKey])


  const handleImageChange = async (
    event:ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {

    if (!event.target.files || event.target.files.length == 0) {
      return;
    }

    // 選択された画像を取得
    const file = event.target.files[0];

    // ファイルパスを指定
    const filePath = `private/${uuidv4()}`

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from("post_thumbnail") // バケット名を指定
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert:false,
      })

      if (error) {
        alert(error.message);
        return;
      }

    setThumbnailImageKey(data.path);

  }

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-3">
        <div>
          <Label htmlFor="title">タイトル</Label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-200 p-3"
          />
        </div>
        <div>
          <Label htmlFor="content">内容</Label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-200 p-3"
          />
        </div>
        <div>
          <Label htmlFor="thumbnailImageKey">サムネイルURL</Label>
          <input
            type="file"
            id="thumbnailImageKey"
            onChange={handleImageChange}
            accept="image/*"
            className="mt-1 block w-full rounded-md border border-gray-200 p-3"
          />
          {thumbnailImageUrl && (
            <div className="mt-2">
              <Image
                src={thumbnailImageUrl}
                alt="thumbnail"
                width={400}
                height={400}
              />
            </div>
          )}
        </div>
        <div>
          <Label>カテゴリー</Label>
          <CategoriesSelect
            selectedCategories={categories}
            setSelectedCategories={setCategories}
            disabled={disabled}
          />
        </div>
        <div>
          <button type="submit" disabled={disabled} className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {mode === "new" ? "作成" : "更新"}
          </button>
          <button type="button" disabled={disabled} onClick={onDelete} className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2">
            削除
          </button>
        </div>
      </div>
    </form>

  );
}
