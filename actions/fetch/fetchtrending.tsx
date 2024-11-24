"use server";

import { notFound } from "next/navigation";

export async function FetchTrending() {
  try {
    const gettrending = await fetch(
      `${process.env.ZENANIME_API_URL}/meta/anilist/trending`
    );
    const trending = await gettrending.json();

    return trending;
  } catch (e) {
    console.error(e);
    return notFound();
  }
}
