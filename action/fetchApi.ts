'use server';

import { FetchGogoAnimeId } from '@/action/getgogoanimeId';

import { ANIME, IAnimeEpisode, IEpisodeServer } from 'asecretpackageforaniscrappingmadebysomeone';
import { redis } from '@/lib/redis';
import { FetchTVDBEps, TVDBEpisode } from './gettvdbEps';
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();
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

export async function getSkipTimes(
    animeIdMal: string,
    episodeNumber: number,
): Promise<SkipTimesResponse | null> {
    const episodeLength = '';
    const typesQuery = ['ed', 'mixed-ed', 'mixed-op', 'op', 'recap'];
    const url = new URL(`https://api.aniskip.com/v2/skip-times/${animeIdMal}/${episodeNumber}`);
    url.searchParams.append('episodeLength', episodeLength.toString());
    typesQuery.forEach((type) => url.searchParams.append('types[]', type));

    try {
        const response = await fetch(url.toString(), {
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



const mapAvailableEpisodes = (gogoAnime: Episode[], tvdb: { [key: string]: TVDBEpisode }, zoro: Episode[], animeDetails: any) => {
    const availableEpisodes = zoro.filter(zoroEpisode =>
        tvdb.hasOwnProperty(zoroEpisode.number.toString())
    ).map(zoroEpisode => {
        const matchedtvdbEpisode = tvdb[zoroEpisode.number.toString()];
        const matchedGogoEpisode = gogoAnime.find(gogoEpisode => gogoEpisode.number === zoroEpisode.number);

        return {
            gogoId: matchedGogoEpisode?.id.replace(/^\//, ''),
            zoroId: zoroEpisode.id.replace(/^\/watch\//, ''),
            tvdbId: matchedtvdbEpisode?.tvdbId,
            rating: matchedtvdbEpisode?.rating || matchedGogoEpisode?.rating || null,
            isFiller: zoroEpisode.isFiller || matchedGogoEpisode?.isFiller || false,
            tvdbTitle: matchedtvdbEpisode?.title.en || zoroEpisode.title, // Assuming you want the English title
            tvdbDescription: matchedtvdbEpisode?.overview || animeDetails.description, // Use AniList description if TVDB is not available
            tvdbImg: matchedtvdbEpisode?.image || animeDetails.coverImage.extraLarge, // Use AniList cover image if TVDB is not available
            tvdbNumber: matchedtvdbEpisode?.episodeNumber || zoroEpisode.number || matchedGogoEpisode?.number,
        };
    });

    return availableEpisodes;
};

export async function FetchEpisodes2(id: string): Promise<any> {
    if (!id) {
        return 0;
    }
    let combine: any;

    try {
        const cachedValue = await redis.get(`episodes:${id}`);
        if (cachedValue) {
            return JSON.parse(cachedValue);
        }
    } catch (error) {
        console.error('Redis error:', error);
    }

    try {
        const response = await fetch('https://anify.eltik.cc/episodes/' + id);
        const epsfetched = await response.json();
        const gogoanime = epsfetched.find((provider: { providerId: string; }) => provider.providerId === "gogoanime").episodes;
        const tvdbeps = (await FetchTVDBEps(Number(id))) || [];
        const zoroEpisodes = epsfetched.find((provider: { providerId: string; }) => provider.providerId === "zoro")?.episodes || [];

        const animeResponse = await fetch(`https://graphql.anilist.co`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query ($id: Int) {
                        Media(id: $id) {
                            description
                            coverImage {
                                extraLarge
                            }
                        }
                    }
                `,
                variables: {
                    id: Number(id),
                },
            }),
        });
        const animeData = await animeResponse.json();
        const animeDetails = animeData.data.Media || {};

        combine = await mapAvailableEpisodes(gogoanime, tvdbeps, zoroEpisodes, animeDetails);
        if (!combine || combine.length === 0) {
            return 0;
        }

        try {
            await redis.set(`episodes:${id}`, JSON.stringify(combine), 'EX', 3600);
        } catch (error) {
            console.error('Failed to cache in Redis:', error);
        }

        return combine;
    } catch (error) {
        console.error('Error fetching episodes:', error);
        return 0;
    }
}

// export async function FetchSource(id: string, dub: boolean) {
//     console.log(id);
//     try {
//         let formatedep = id;
//         if (dub == true) {
//             const episodeParts = (id ?? "").split("-");
//             const episodeIndex = episodeParts.indexOf("episode");
//             if (episodeIndex !== -1) {
//                 episodeParts.splice(episodeIndex, 0, "dub");
//             }
//             const dubepid = episodeParts.join("-");
//             formatedep = dubepid
//         }
//         const fetchurl = await gogoAnime.fetchEpisodeSources(formatedep);
//         console.log(fetchurl);
//         return fetchurl;
//     }
//     catch (error) {
//         return null;
//     }
// }

export async function FetchSource(id: string, dub: boolean) {
    try {
        let epsid = id;
        let language: "sub" | "dub" | "raw" | undefined = 'sub';
        if (dub == true) {
            language = 'dub';
        }
        const fetchurl = await hianime.getEpisodeSources(epsid, 'hd-1', language);
        return fetchurl;
    }
    catch (error) {
        return null;
    }
}


export async function FetchServers(id: string) {
    console.log(id);
    let fetchurl: { sub: IEpisodeServer[], dub: IEpisodeServer[] } = {
        sub: [],
        dub: []
    };

    try {
        let subid = id;

        const episodeParts = (id ?? "").split("-");
        const episodeIndex = episodeParts.indexOf("episode");
        if (episodeIndex !== -1) {
            episodeParts.splice(episodeIndex, 0, "dub");
        }
        const dubid = episodeParts.join("-");

        fetchurl.sub = await gogoAnime.fetchEpisodeServers(subid) || [];

        try {
            fetchurl.dub = await gogoAnime.fetchEpisodeServers(dubid) || [];
        } catch (error) {
            console.error("Error fetching dub servers:", error);
        }

        return fetchurl;
    }
    catch (error) {
        console.error("Error fetching sub servers:", error);
        return fetchurl;
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