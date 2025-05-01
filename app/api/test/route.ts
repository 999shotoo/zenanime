
import { META } from '@consumet/extensions';
import Zoro from '@consumet/extensions/dist/providers/anime/zoro';

const animeProvider = new META.Anilist(new Zoro());

export async function GET(request: Request) {
  const data = await animeProvider.fetchEpisodesListById('21')
  return Response.json({ data }, { status: 200 });
}
