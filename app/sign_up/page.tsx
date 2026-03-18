'use client'

import { supabase } from "@/app/_libs/supabase";
import { useState } from "react";
import Input from "@/app/_components/Input"

export default function Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
      },
    });

    if (error) {
      alert("登録に失敗しました")
    } else {
      setEmail("")
      setPassword("")
      alert("確認メールを送信しました")
    }

    setSubmitting(false);
  }

  return (
    <div className="flex justify-center pt-60">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-100">
        <div className="grid gap-3">
          <Input
            label="メールアドレス"
            type="email"
            id="email"
            placeholder="name@company.com"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={isSubmitting}
            withStyle={false}
            />
          <Input
            label="パスワード"
            type="password"
            id="password"
            placeholder="••••••••"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            disabled={isSubmitting}
            withStyle={false}
            />
        </div>
        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isSubmitting}
          >
            登録
          </button>
        </div>
      </form>
    </div>
  );
}
