
import FormItem from "@/app/_components/FormItem";
import FormStyle from "@/app/_styles/Form.module.css";
import { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"textarea"> & {
  label: string;
};

const TextArea = ({ label, rows = 8, id, ...textAreaProps }:Props) => {
  return (
    <FormItem label={label} htmlFor={id} >
      <textarea
        {...textAreaProps}
        id={id}
        rows={rows}
        className={FormStyle.textBox}
      />
    </FormItem>
  );
  }


export default TextArea;
