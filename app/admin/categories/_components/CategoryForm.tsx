import Input from "@/app/_components/Input"
import FormStyle from "@/app/_styles/Form.module.css";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  name:string
}

type Props = {
  mode: "new" | "edit",
  defaultValue?: string
  onSubmit: (data: FormValues) => void
  onDelete?: () => void
  disabled: boolean
}

export default function CategoryForm({
  mode,
  defaultValue,
  onSubmit,
  onDelete,
  disabled
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState:{errors}
  } = useForm<FormValues>();
  useEffect(() => {
    reset({ name: defaultValue || "" });
  }, [defaultValue, reset]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-3">
          <Input
            label="カテゴリー名"
            type="text"
            id="name"
            {...register("name",{required:"カテゴリー名を入力してください"})}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-200 p-3"
            withStyle={false}
        />
        {errors.name && ( <p className={FormStyle.error}>{ errors.name?.message }</p> ) }
        <div>
          <button
            type="submit"
            disabled={disabled}
            className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {mode === "new" ? "作成" : "更新"}
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={onDelete}
            className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2">
            削除
          </button>
        </div>
      </div>
    </form>
  );
}
