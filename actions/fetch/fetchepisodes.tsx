"use server";

import { Ani2MalId } from "./ani2malid";

export default async function fetchEpisodes(id: string, provider: string) {
  try {
    const ani_id = Ani2MalId(id);
    const geteps = await fetch(
      `${process.env.ZENANIME_API_URL}/meta/anilist/episodes/${ani_id}?provider=${provider}`
    );
    const episodes = await geteps.json();
    return episodes;
  } catch (e) {
    console.error(e);
    return null;
  }
}
