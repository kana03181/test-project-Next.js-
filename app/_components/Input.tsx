
import FormItem from "@/app/_components/FormItem";
import FormStyle from "@/app/_styles/Form.module.css";
import { forwardRef } from "react";

type Props = React.ComponentProps<"input"> & {
  label: string;
  withStyle?: boolean;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({label, id, withStyle, ...inputProps},  ref) => {
  return (
    <FormItem label={label} htmlFor={id} withStyle={withStyle}>
    <input
      {...inputProps}
      id={id}
      ref={ref}
      className={`${FormStyle.textBox} ${inputProps.className ?? ""}`}
      />
    </FormItem>
  );
})

export default Input;
