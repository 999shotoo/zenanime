
import { META } from '@consumet/extensions';
import Zoro from '@consumet/extensions/dist/providers/anime/zoro';

const animeProvider = new META.Anilist(new Zoro('https://hianimez.to/'));

export async function GET(request: Request) {
  const data = await animeProvider.fetchEpisodeSources('spy-x-family-17977$episode$89506$both')
  return Response.json({ data }, { status: 200 });
}
