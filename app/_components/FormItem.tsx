"use client";

import Label from "@/app/_components/Label";
import FormStyle from "@/app/_styles/Form.module.css";

type Props = React.ComponentProps<"div">&{
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  withStyle?: boolean;
}

export default function FormItem({
  label,
  htmlFor,
  children,
  className,
  withStyle= true,
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${withStyle ? FormStyle.formItem : ""} ${className ?? ""}`}
    >
      <Label htmlFor={htmlFor}>
        {label}
      </Label>
      <div className={FormStyle.formControl}>
        {children}
      </div>
    </div>
  );
}
