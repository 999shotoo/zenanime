"use server";

export async function fetchInfo(id: string) {
  try {
    const res = await fetch(`${process.env.JIKAN_API_URL}/v4/anime/${id}`);
    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}
