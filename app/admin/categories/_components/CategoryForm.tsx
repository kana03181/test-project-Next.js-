import Input from "@/app/_components/Input"


type Props = {
  mode: "new" | "edit",
  name: string
  setName: (name: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onDelete?: () => void
  disabled: boolean
}

export default function CategoryForm({
  mode,
  name,
  setName,
  onSubmit,
  onDelete,
  disabled
}:Props) {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-3">
          <Input
            label="カテゴリー名"
            type="text"
            id="title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-200 p-3"
            withStyle={false}
          />
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
