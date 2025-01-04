"use server";

import { redis } from "@/lib/redis";

export interface TVDBEpisode {
    tvdbShowId: number;
    tvdbId: number;
    seasonNumber: number;
    episodeNumber: number;
    absoluteEpisodeNumber: number;
    title: {
        ja: string;
        en: string;
        'x-jat': string;
    };
    airDate: string;
    airDateUtc: string;
    runtime: number;
    overview: string;
    image: string;
    episode: string;
    anidbEid: number;
    length: number;
    airdate: string;
    rating: string;
    summary: string;
    finaleType?: string;
}

interface AnimeDetails {
    description: string;
    coverImage: { extraLarge: string };
}

interface ZoroEpisode {
    title: string;
    episode_no: number;
    id: string;
    filler: boolean;
}



export const FetchTVDBEps = async (id: number) => {
    if (!id) {
        return {};
    }
    try {
        const fetchmapping = await fetch(`https://api.ani.zip/mappings?anilist_id=${id}`);
        const mapping: any = await fetchmapping.json();
        return mapping.episodes || {};
    } catch (error) {
        console.error("Error fetching TVDB episodes:", error);
        return {};
    }
};



const mapZoroEpisodes = async (zoroEpisodes: ZoroEpisode[], tvdbEpisodes: { [key: string]: TVDBEpisode }, animeDetails: AnimeDetails) => {
    const combinedEpisodes = zoroEpisodes.map(zoroEpisode => {
        const matchedTvdbEpisode = tvdbEpisodes[zoroEpisode.episode_no.toString()];

        return {
            zoroId: zoroEpisode.id,
            tvdbId: matchedTvdbEpisode?.anidbEid || null,
            title: zoroEpisode.title,
            episodeNumber: zoroEpisode.episode_no || matchedTvdbEpisode?.episode,
            isFiller: zoroEpisode.filler,
            tvdbTitle: matchedTvdbEpisode?.title.en || zoroEpisode.title,
            tvdbDescription: matchedTvdbEpisode?.overview || matchedTvdbEpisode?.summary || null,
            tvdbImg: matchedTvdbEpisode?.image || animeDetails.coverImage.extraLarge || null,
            rating: matchedTvdbEpisode?.rating || null,
            airdate: matchedTvdbEpisode?.airdate || null,
        };
    });

    return combinedEpisodes;
};

export async function FetchEpisodesAll(id: string): Promise<any> {
    if (!id) {
        return 0;
    }
    try {
        const cachedEpisodes = await redis.get(`episodes:${id}`);
        if (cachedEpisodes) {
            return JSON.parse(cachedEpisodes);
        }
    } catch (error) {
        console.error("Error fetching cached episodes:", error);
    }

    try {
        const zoroId = await FetchZoroId(id);
        const response = await fetch(`https://anime-api-peach.vercel.app/api/episodes/${zoroId}`);
        const zoroData = await response.json();
        const zoroEpisodes: any[] = (zoroData as any).results.episodes || [];
        const tvdbEpisodes = await FetchTVDBEps(Number(id)) || {};
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
        const animeData: any = await animeResponse.json();
        const animeDetails = animeData.data.Media || {};
        const combinedEpisodes = await mapZoroEpisodes(zoroEpisodes, tvdbEpisodes, animeDetails);
        await redis.set(`episodes:${id}`, JSON.stringify(combinedEpisodes), 'EX', 60 * 60);
        return combinedEpisodes.length > 0 ? combinedEpisodes : 0;
    } catch (error) {
        console.error('Error fetching episodes:', error);
        return 0;
    }
}


export const FetchZoroId = async (id: string) => {
    if (!id) {
        console.error("No ID provided");
        return 0;
    }
    try {
        const response = await fetch(`https://api.malsync.moe/mal/anime/anilist:${id}`);

        if (!response.ok) {
            console.error(`Failed to fetch Zoro ID, status: ${response.status}`);
            return 0;
        }

        const res: any = await response.json();
        console.log("Response data:", res);

        if (!res.Sites || !res.Sites.Zoro) {
            console.error("Zoro data not found in response:", res);
            return 0;
        }

        const zoro = res.Sites.Zoro;
        const zoroKey = Object.keys(zoro)[0];
        const zoroUrl = zoro[zoroKey].url;
        const zoroId = zoroUrl.split('/').pop();
        return zoroId;
    } catch (error) {
        console.error("Error fetching Zoro ID:", error);
        return 0;
    }
};