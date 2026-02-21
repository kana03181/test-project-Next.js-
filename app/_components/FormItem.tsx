"use client";

import Label from "@/app/_components/Label";
import FormStyle from "@/app/_styles/Form.module.css";

type Props = {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}

export default function FormItem({label, htmlFor, children}:Props) {
  return (
    <div className={FormStyle.formItem}>
      <Label htmlFor={htmlFor}>
        {label}
      </Label>
      <div className={FormStyle.formControl}>
        {children}
      </div>
    </div>
  );
}
