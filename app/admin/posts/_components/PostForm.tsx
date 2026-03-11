
import { Category } from "@/app/api/admin/posts/[id]/route";
import CategoriesSelect from "@/app/admin/posts/_components/CategoriesSelect"
import Label from "@/app/_components/Label"

type Props = {
  mode: "new" | "edit"
  title: string
  setTitle:(title: string) => void
  content: string
  setContent: (content: string) => void
  thumbnailUrl: string
  setThumbnailUrl: (thumbnailUrl: string) => void
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
  thumbnailUrl,
  setThumbnailUrl,
  categories,
  setCategories,
  onSubmit,
  onDelete,
  disabled
}: Props) {
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
          <Label htmlFor="thumbnailUrl">サムネイルURL</Label>
          <input
            type="text"
            id="thumbnailUrl"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-200 p-3"
          />
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
