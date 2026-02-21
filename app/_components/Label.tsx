"use client";

import FormStyle from "@/app/_styles/Form.module.css";

type Props = React.ComponentProps<"label"> & {
  htmlFor?: string;
  children: string;
};

export default function Label({ htmlFor, children }:Props) {
  return (
    <label htmlFor={htmlFor} className={FormStyle.name}> { children } </label>
  );
}
