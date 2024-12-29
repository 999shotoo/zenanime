'use server';

import { FetchGogoAnimeId } from '@/action/getgogoanimeId';
import { type NextRequest } from 'next/server';

import { ANIME, IAnimeEpisode } from 'asecretpackageforaniscrappingmadebysomeone';
import { redis } from '@/lib/redis';
import { FetchTVDBEps, TVDBEpisode } from './gettvdbEps';

const gogoAnime = new ANIME.Gogoanime();



interface SkipTime {
    type: string;
    start: number;
    end: number;
}

interface SkipTimesResponse {
    episodeId: string;
    skips: SkipTime[];
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

async function getSkipTimes(
    animeIdMal: string,
    episodeNumber: number,
): Promise<SkipTimesResponse | null> {
    const episodeLength = '';
    const typesQuery = ['ed', 'mixed-ed', 'mixed-op', 'op', 'recap'];
    const url = `https://api.aniskip.com/v2/skip-times/${animeIdMal}/${episodeNumber}?${typesQuery}&episodeLength=${episodeLength}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data: SkipTimesResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch skip times:', error);
        return null;
    }
}


// const mapAvailableEpisodes = (gogoAnime: Episode[], tvdb: TVDBEpisode[], zoro: Episode[]) => {
//     const availableEpisodes = gogoAnime.filter(gogoEpisode =>
//         tvdb.some(tvdbEpisode => tvdbEpisode.number === gogoEpisode.number)
//     ).map(gogoEpisode => {
//         const matchedtvdbEpisode = tvdb.find(tvdbEpisode => tvdbEpisode.number === gogoEpisode.number);
//         const matchedZoroEpisode = zoro.find(zoroEpisode => zoroEpisode.number === gogoEpisode.number);

//         return {
//             gogoId: gogoEpisode.id.replace(/^\//, ''),
//             zoroId: matchedZoroEpisode?.id.replace(/^\/watch\//, ''),
//             tvdbId: matchedtvdbEpisode?.id,
//             tvdbTitle: matchedtvdbEpisode?.title,
//             tvdbDescription: matchedtvdbEpisode?.description,
//             tvdbImg: matchedtvdbEpisode?.img,
//             tvdbNumber: matchedtvdbEpisode?.number,
//             tvdbIsFiller: matchedtvdbEpisode?.isFiller,
//         };
//     });

//     return availableEpisodes;
// };

// export async function FetchEpisodes(id: string): Promise<any> { 
//     if (!id) {
//         return 0;
//     }
//     let combine: any; 

//     try {
//         const cachedValue = await redis.get(`episodes:${id}`);
//         if (cachedValue) {
//             return JSON.parse(cachedValue);
//         }
//     } catch (error) {
//         console.error('Redis error:', error);
//     }

//     try {
//         const gogoId = await FetchGogoAnimeId(id);
//         if (!gogoId) {
//             return 0;
//         }
//         // Fetch Zoro episodes
//         const response = await fetch('https://anify.eltik.cc/episodes/' + id);
//         const epsfetched = await response.json();
//         const gogoanime = epsfetched.find((provider: { providerId: string; }) => provider.providerId === "gogoanime").episodes;
//         const tvdbeps = (await FetchTVDBEps(Number(id))) || [];

//         const zoroEpisodes = epsfetched.find((provider: { providerId: string; }) => provider.providerId === "zoro")?.episodes || [];

//         combine = await mapAvailableEpisodes(gogoanime, tvdbeps, zoroEpisodes);
//         if (!combine || combine.length === 0) {
//             return 0;
//         }

//         try {
//             await redis.set(`episodes:${id}`, JSON.stringify(combine), 'EX', 3600);
//         } catch (error) {
//             console.error('Failed to cache in Redis:', error);
//         }

//         return combine;
//     } catch (error) {
//         console.error('Error fetching episodes:', error);
//         return 0;
//     }
// }

export async function FetchSource(id: string, dub: boolean) {
    console.log(id);
    try {
        let formatedep = id;
        if (dub == true) {
            const episodeParts = (id ?? "").split("-");
            const episodeIndex = episodeParts.indexOf("episode");
            if (episodeIndex !== -1) {
                episodeParts.splice(episodeIndex, 0, "dub");
            }
            const dubepid = episodeParts.join("-");
            formatedep = dubepid
        }
        const fetchurl = await gogoAnime.fetchEpisodeSources(formatedep);
        console.log(fetchurl);
        return fetchurl;
    }
    catch (error) {
        return null;
    }
}

export async function FetchEpisodes(id: string) {

    const cacheddata = await redis.get(`episodes:${id}`);
    if (cacheddata) {
        return JSON.parse(cacheddata);
    }
    try {
        const fetcheps = await fetch(`https://shiroko.co/api/v2/episode/${id}`, {
            headers: {
                "referer": "https://shiroko.co/"
            }
        });
        const episodes = await fetcheps.json();
        const gogoeps = await episodes.data.find((ep: any) => ep.providerId === 'gogoanime').episodes;
        await redis.set(`episodes:${id}`, JSON.stringify(gogoeps), 'EX', 3600);
        return gogoeps;
    } catch (error) {
        return 0;
    }
}