// import { FetchGogoAnimeId } from '@/action/getgogoanimeId';
// import { AnimeInfoAnilist, SeasonalAnilist, TrendingAnilist } from '@/lib/anilist/anilistapi';
// import { type NextRequest } from 'next/server'
// import { FetchTMDBEps } from '@/action/getTMDBEps';
// import { ANIME, IAnimeEpisode } from '@consumet/extensions';
// import { redis } from '@/lib/redis';


// interface TMDBEpisode {
//     id: string;
//     description: string;
//     hasDub: boolean;
//     img: string;
//     isFiller: boolean;
//     number: number;
//     title: string;
//     updatedAt: number;
//     rating: number;
// }

// const mapAvailableEpisodes = (gogoAnime: IAnimeEpisode[], tmdb: TMDBEpisode[]) => {
//     const availableEpisodes = gogoAnime.filter(gogoEpisode =>
//         tmdb.some(tmdbEpisode => tmdbEpisode.number === gogoEpisode.number)
//     ).map(gogoEpisode => {
//         const matchedTMDBEpisode = tmdb.find(tmdbEpisode => tmdbEpisode.number === gogoEpisode.number);
//         return {
//             gogoId: gogoEpisode.id,
//             gogoUrl: gogoEpisode.url,
//             tmdbId: matchedTMDBEpisode?.id,
//             tmdbTitle: matchedTMDBEpisode?.title,
//             tmdbDescription: matchedTMDBEpisode?.description,
//             tmdbImg: matchedTMDBEpisode?.img,
//             tmdbNumber: matchedTMDBEpisode?.number,
//             tmdbIsFiller: matchedTMDBEpisode?.isFiller,
//         };
//     });
//     return availableEpisodes;
// };

// const gogoAnime = new ANIME.Gogoanime();

// export async function GET(request: NextRequest) {
//     const searchParams = request.nextUrl.searchParams
//     const id = searchParams.get('id')
//     if (!id) {
//         return Response.json({ error: 'id is required' }, { status: 400 })
//     }
//     try {
//         const cachedValue = await redis.get(`episodes:${id}`)
//         if (cachedValue) {
//             return Response.json(JSON.parse(cachedValue), { status: 200 })
//         }
//         const gogoId = await FetchGogoAnimeId(id);
//         if (!gogoId) {
//             return Response.json({ error: 'No episodes found' }, { status: 404 })
//         }
//         const goganimeeps = (await gogoAnime.fetchAnimeInfo(gogoId)).episodes || [];
//         const tmdbeps = (await FetchTMDBEps(Number(id))) || [];
//         const combine = await mapAvailableEpisodes(goganimeeps, tmdbeps);
//         if (!combine || combine.length === 0) {
//             return Response.json({ error: 'No episodes found' }, { status: 404 })
//         }
//         await redis.set(`episodes:${id}`, JSON.stringify(combine), 'EX', 3600)
//         return Response.json(combine, { status: 200 })
//     } catch (error) {
//         console.log(error)
//         return Response.json({ error }, { status: 500 })
//     }
// }