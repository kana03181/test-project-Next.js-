
import FormItem from "@/app/_components/FormItem";
import FormStyle from "@/app/_styles/Form.module.css";
import { forwardRef } from "react";

type Props = React.ComponentProps<"textarea"> & {
  label: string;
};

const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, rows = 8, id, ...textAreaProps }, ref) => {
  return (
    <FormItem label={label} htmlFor={id} >
      <textarea
        {...textAreaProps}
        id={id}
        ref={ref}
        rows={rows}
        className={FormStyle.textBox}
      />
    </FormItem>
  );
})

export default TextArea;
