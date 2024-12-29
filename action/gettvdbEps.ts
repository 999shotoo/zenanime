'use server';

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

export const FetchTVDBEps = async (id: number) => {
    if (!id) {
        return 0;
    }
    try {

        const fetchmapping = await fetch(`https://api.ani.zip/mappings?anilist_id=${id}`);
        const mapping = await fetchmapping.json();
        const tmdb = mapping.episodes

        return tmdb;
    } catch (error) {
        return 0;
    }
};

