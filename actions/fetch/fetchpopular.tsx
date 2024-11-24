"use server";

export async function fetchAnimePopular(page: number) {
  try {
    const response = await fetch(
      `${process.env.JIKAN_API_URL}/v4/top/anime?filter=bypopularity&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}
