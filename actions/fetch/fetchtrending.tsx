"use server";

import { notFound } from "next/navigation";

export async function FetchTrending() {
  try {
    const gettrending = await fetch(
      "https://animeapi.giize.com/meta/anilist/trending"
    );
    const trending = await gettrending.json();

    return trending;
  } catch (e) {
    console.error(e);
    return notFound();
  }
}
