import { FetchSource } from "@/action/fetchApi";

export async function GET() {
  const episode = await FetchSource("your-name-10?ep=57910", true);
  return Response.json(episode);
}
