
import { Category } from "@/app/api/admin/posts/[id]/route";
import CategoriesSelect from "@/app/admin/posts/_components/CategoriesSelect"
import Label from "@/app/_components/Label"
import Input from "@/app/_components/Input"
import { supabase } from "@/app/_libs/supabase";
import { v4 as uuidv4 } from "uuid";
import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";

type FormData = {
  title: string
  content: string
  thumbnailImageKey: string
  categories: Category[]
}

type Props = {
  mode: "new" | "edit"
  defaultValues: FormData
  onSubmit: (data: FormData) => void
  onDelete?: () => void
  disabled: boolean
}

export default function PostForm({
  mode,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) {

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState:{isSubmitting}

  } = useForm<FormData>({
    defaultValues
  });

  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null);
  const thumbnailImageKey = watch("thumbnailImageKey");


  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset])

  // 画像URL取得
  useEffect(() => {
    if (!thumbnailImageKey) return;

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };
    fetcher();
  }, [thumbnailImageKey]);

  // 画像アップロード
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const file = event.target.files[0];
    const filePath = `private/${uuidv4()}`;

    const { data, error } = await supabase.storage
      .from("post_thumbnail")
      .upload(filePath, file);

    if (error) {
      alert(error.message);
      return;
    }

    // RHFに値をセット
    setValue("thumbnailImageKey", data.path, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <div className="grid gap-3">
      <div>
        <Input
          {...register("title", { required:"必須です" } )}
          label="タイトル"
          type="text"
          id="title"
          disabled={disabled || isSubmitting}
          withStyle={false}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div>
        <Label htmlFor="content">内容</Label>
        <textarea
          {...register("content", { required:"必須です" })}
          id="content"
          disabled={disabled || isSubmitting}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div>
        <Input
          label="サムネイルURL"
          type="file"
          id="thumbnailImageKey"
          withStyle={false}
          onChange={handleImageChange}
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
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <CategoriesSelect
              value={field.value}
              onChange={field.onChange}
              disabled={disabled || isSubmitting}
            />
          )}
        />
      </div>
      <div>
        <button type="submit" disabled={disabled || isSubmitting} className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {mode === "new" ? "作成" : "更新"}
        </button>
        {onDelete && (
          <button type="button" disabled={disabled || isSubmitting} onClick={onDelete} className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2">
            削除
          </button>
        )}
      </div>
    </div>
  </form>
);


}
