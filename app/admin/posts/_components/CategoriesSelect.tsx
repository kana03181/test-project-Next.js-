
import { Category } from "@/app/api/admin/posts/[id]/route";
import { useState, useEffect } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

type Props = {
  value: Category[]
  onChange: (categories: Category[]) => void
  disabled: boolean
}

export default function CategoriesSelect({
  value,
  onChange,
  disabled
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { token } = useSupabaseSession();

  const toggleCategory = (id: number) => {
    if (disabled) return;

    const exists = value.some((category) => category.id === id)

    if (exists) {
      onChange(
        value.filter((category) => category.id !== id )
      )
      return
    }

    const category = categories.find((c) => c.id === id);
    if (!category) return;
    onChange([...value, category])
  }

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const res = await fetch("/api/admin/categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,

        }
      });
      const { categories } = await res.json();
      setCategories(categories);
    }

    fetcher()
  }, [token])


  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        { categories.map((category) => {
          const isSelected = value.some(
            (selected) => selected.id === category.id
          )
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={[
                'rounded-full border px-3 py-1 text-sm',
                isSelected
                  ? 'border-blue-600 bg-blue-600 text-white'
                  :'border-gray-300 bg-white text-gray-800',
              ].join(" ")}
            >
              {category.name}
            </button>
          )
        })}
      </div>
    </div>
  );
}
