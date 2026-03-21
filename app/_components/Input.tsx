
import FormItem from "@/app/_components/FormItem";
import FormStyle from "@/app/_styles/Form.module.css";
import { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"input"> & {
  label: string;
  withStyle?: boolean;
}

const Input = ({label, id, withStyle, ...inputProps}: Props) => {
  return (
    <FormItem label={label} htmlFor={id} withStyle={withStyle}>
    <input
      {...inputProps}
      id={id}
      className={`${FormStyle.textBox} ${inputProps.className ?? ""}`}
      />
    </FormItem>
  );
}
export default Input;
