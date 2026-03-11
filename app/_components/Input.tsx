
import FormItem from "@/app/_components/FormItem";
import FormStyle from "@/app/_styles/Form.module.css";

type Props = React.ComponentProps<"input"> & {
  label: string;
  withStyle?: boolean;
}

export default function Input({label, id, withStyle, ...inputProps}:Props) {
  return (
    <FormItem label={label} htmlFor={id} withStyle={withStyle}>
    <input
      {...inputProps}
      id={id}
      className={FormStyle.textBox}
      />
    </FormItem>
  );
}
