import { FetchGogoAnimeId } from '@/action/getgogoanimeId';
import { AnimeInfoAnilist, SeasonalAnilist, TrendingAnilist } from '@/lib/anilist/anilistapi';
import { type NextRequest } from 'next/server'

import { FetchTVDBEps } from '@/action/gettvdbEps';


interface TMDBEpisode {
    id: string;
    description: string;
    hasDub: boolean;
    img: string;
    isFiller: boolean;
    number: number;
    title: string;
    updatedAt: number;
    rating: number;
}

interface Episode {
    id: string;
    isFiller: boolean;
    number: number;
    title: string;
    img: string | null;
    hasDub: boolean;
    description: string | null;
    rating: number | null;
    updatedAt: number;
}

const mapAvailableEpisodes = (gogoAnime: Episode[], tmdb: TMDBEpisode[], zoro: Episode[]) => {
    const availableEpisodes = gogoAnime.filter(gogoEpisode =>
        tmdb.some(tmdbEpisode => tmdbEpisode.number === gogoEpisode.number)
    ).map(gogoEpisode => {
        const matchedTMDBEpisode = tmdb.find(tmdbEpisode => tmdbEpisode.number === gogoEpisode.number);
        const matchedZoroEpisode = zoro.find(zoroEpisode => zoroEpisode.number === gogoEpisode.number);

        return {
            gogoId: gogoEpisode.id.replace(/^\//, ''),
            zoroId: matchedZoroEpisode?.id.replace(/^\/watch\//, ''),
            tmdbId: matchedTMDBEpisode?.id,
            tmdbTitle: matchedTMDBEpisode?.title,
            tmdbDescription: matchedTMDBEpisode?.description,
            tmdbImg: matchedTMDBEpisode?.img,
            tmdbNumber: matchedTMDBEpisode?.number,
            tmdbIsFiller: matchedTMDBEpisode?.isFiller,
        };
    });

    return availableEpisodes;
};


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    if (!id) {
        return Response.json({ error: 'id is required' }, { status: 400 })
    }
    try {

        const gogoId = await FetchGogoAnimeId(id);
        if (!gogoId) {
            return Response.json({ error: 'No episodes found' }, { status: 404 })
        }
        const geteps = await fetch('https://anify.eltik.cc/episodes/' + id)
        const epsfetched = await geteps.json()
        const zoro = epsfetched.find((provider: { providerId: string; }) => provider.providerId === "zoro").episodes;
        const gogoanime = epsfetched.find((provider: { providerId: string; }) => provider.providerId === "gogoanime").episodes;
        const tmdbeps = (await FetchTVDBEps(Number(id))) || [];
        const combine = await mapAvailableEpisodes(gogoanime, tmdbeps, zoro);
        if (!combine || combine.length === 0) {
            return Response.json({ error: 'No episodes found' }, { status: 404 })
        }
        return Response.json(combine, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json({ error }, { status: 500 })
    }
}