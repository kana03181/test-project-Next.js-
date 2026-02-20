"use client";

import { useState } from "react";
import type { FormErrors } from "@/app/_types/contact";
import Input from "@/app/_components/Input";
import TextArea from "@/app/_components/TextArea";
import FormStyle from "@/app/_styles/Form.module.css";


export default function contact() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "お名前は必須です。"
    } else if( name.length > 30 ){
      newErrors.name = "お名前は30文字以内で入力してください。"
    }

    if (!email.trim()) {
      newErrors.email = "メールアドレスは必須です。"
    } else if( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ){
      newErrors.email = "メールアドレスの形式が正しくありません。"
    }

    if (!message.trim()) {
      newErrors.message = "本文は必須です。"
    } else if( message.length > 500 ){
      newErrors.message = "本文は500文字以内で入力してください。";
    }

    return newErrors;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message
        })
      });

      if (!res.ok) {
        throw new Error("送信に失敗しました");
      }
      alert("送信しました");
      handleClear();

    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("エラーが発生しました");
      }

    } finally {
      setIsSubmitting(false);
    }
  }

  const handleClear = () => {
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
  }
  return (
    <div className={FormStyle.container}>
      <h2 className={FormStyle.title}>問合わせフォーム</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="お名前"
          type="text"
          id="name"
          name="name"
          value={name}
          disabled={isSubmitting}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className={FormStyle.error}>{ errors.name }</p>}
        <Input
          label="メールアドレス"
          type="email"
          id="email"
          name="email"
          value={email}
          disabled={isSubmitting}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className={FormStyle.error}>{ errors.email }</p>}
        <TextArea
          label="本文"
          id="message"
          name="message"
          value={message}
          disabled={isSubmitting}
          onChange={(e) => setMessage(e.target.value)}
        />
        {errors.message && <p className={FormStyle.error}>{errors.message}</p>}

        <div className={FormStyle.btnWrap}>
          <button type="submit" disabled={isSubmitting} className={`${FormStyle.btn} ${FormStyle.submit}`}>送信</button>
          <button type="button" disabled={isSubmitting} onClick={handleClear} className={`${FormStyle.btn} ${FormStyle.clear}`}>クリア</button>
        </div>
      </form>
    </div>

  );
}
