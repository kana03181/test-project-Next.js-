"use client";

import FormItem from "@/app/_components/FormItem";
import FormStyle from "@/app/_styles/Form.module.css";

type Props = React.ComponentProps<"input"> & {
  label: string;
}

export default function Input({label, ...inputProps}:Props) {
  return (
    <FormItem label={label}>
    <input
      {...inputProps}
      className={FormStyle.textBox}
      />
    </FormItem>
  );
}
