"use server";
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();
export default async function fetchWatchUrl(eps_id: string) {
  try {
    const animewatchurl = await hianime.getEpisodeSources(
      eps_id ?? "",
      "hd-1",
      "dub"
    );
    return animewatchurl;
  } catch (e) {
    console.error(e);
    return null;
  }
}
