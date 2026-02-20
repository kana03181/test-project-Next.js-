"use client";

import FormItem from "@/app/_components/FormItem";
import FormStyle from "@/app/_styles/Form.module.css";

type Props = React.ComponentProps<"textarea"> & {
  label: string;
};

export default function TextArea({label,  rows=8, ...textAreaProps}:Props) {
  return (
    <FormItem label={label} htmlFor={textAreaProps.id}>
      <textarea
        {...textAreaProps}
        rows={rows}
        className={FormStyle.textBox}
      />
    </FormItem>
  );
}
