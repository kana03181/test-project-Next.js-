"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from "swr";

export const useFetch = <T> (url: string) => {
  const { token } = useSupabaseSession();

  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      }
    });

    return res.json();
  }

  const { data, error, isLoading} = useSWR<T>(
    token ? url : null,
    fetcher
  );

  return { data, error, isLoading};

}
