"use client";

import { useState } from "react";
import type { FormErrors } from "@/app/_types/contact";
import Input from "@/app/_components/Input";
import TextArea from "@/app/_components/TextArea";
import FormStyle from "@/app/_styles/Form.module.css";
import { useForm, SubmitHandler } from "react-hook-form";

type FormData = {
  name: string
  email: string
  message: string
}

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
      try {
        const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data)
        });

        if (!res.ok) {
          throw new Error("送信に失敗しました");
        }
        alert("送信しました");
        reset();

      } catch (err) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert("エラーが発生しました");
        }
    }
  }
  return (
    <div className={FormStyle.container}>
      <h2 className={FormStyle.title}>問合わせフォーム</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="お名前"
          {...register("name", {
            required: "お名前は必須です。",
            maxLength: {
              value: 30,
              message: "お名前は30文字以内で入力してください。",
            },
          })}
          disabled={isSubmitting}
          // type="text"
          // id="name"
          // name="name"
          // value={name}
          // onChange={(e) => setName(e.target.value)}
        />
        {errors.name && ( <p className={FormStyle.error}>{ errors.name.message }</p> )}
        <Input
          label="メールアドレス"
          type="email"
          {...register("email", {
            required: "メールアドレスは必須です。",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "メールアドレスの形式が正しくありません。",
            },
          })}
          // id="email"
          // name="email"
          // value={email}
          // onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />
        {errors.email && ( <p className={FormStyle.error}>{ errors.email.message }</p> )}
        <TextArea
          label="本文"
          {...register("message", {
            required: "本文は必須です。",
            maxLength: {
              value: 500,
              message: "本文は500文字以内で入力してください。",
            },
          })}
          // id="message"
          // name="message"
          // value={message}
          // onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
        />
        {errors.message && ( <p className={FormStyle.error}>{errors.message.message}</p> )}

        <div className={FormStyle.btnWrap}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${FormStyle.btn} ${FormStyle.submit}`}
          >
            送信
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => reset()}
            className={`${FormStyle.btn} ${FormStyle.clear}`}
          >
            クリア
          </button>
        </div>
      </form>
    </div>

  );
}
