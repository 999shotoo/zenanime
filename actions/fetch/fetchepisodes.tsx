"use server";

import { HiAnime } from "aniwatch";
import { fetchZoroId } from "./fetchzoroid";

const hianime = new HiAnime.Scraper();

export default async function fetchEpisodes(id: string) {
  try {
    const zoroid = await fetchZoroId(id);
    const episodes = await hianime.getEpisodes(zoroid);
    return episodes.episodes;
  } catch (e) {
    console.error(e);
    return null;
  }
}
