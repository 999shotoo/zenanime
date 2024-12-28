// import { type NextRequest } from 'next/server'
// import { META } from '@consumet/extensions';
// import { FetchEpisodes } from '@/action/fetchApi';

// const anilist = new META.Anilist();

// export async function GET(request: NextRequest) {
//     const searchParams = request.nextUrl.searchParams
//     const id = searchParams.get('id')
//     const ep = searchParams.get('ep')
//     if (!id || !ep) {
//         return Response.json({ error: 'id and ep is required' }, { status: 400 })
//     }
//     try {
//         const getepisodes = await FetchEpisodes(id as any);
//         if (!getepisodes || getepisodes.length === 0) {
//             return Response.json({ error: 'Episode not found' }, { status: 404 })
//         }
//         const foundEpisode = getepisodes.find((episode: { number: number; }) => episode.number === parseInt(ep));
//         if (!foundEpisode) {
//             return Response.json({ error: 'Episode not found' }, { status: 404 })
//         }

//         const sourcelink = await anilist.fetchEpisodeSources(foundEpisode.id);

//         return Response.json({ 'stream': sourcelink, 'epinfo': foundEpisode }, { status: 200 })
//     } catch (error) {
//         return Response.json({ error }, { status: 500 })
//     }
// }