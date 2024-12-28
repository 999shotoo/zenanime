'use server';

export interface TVDBEpisode {
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

interface EpisodeData {
    id: string;
    episode: string;
}


export const FetchTVDBEps = async (id: number) => {
    if (!id) {
        return 0;
    }
    try {

        const fetchmapping = await fetch(`https://anify.eltik.cc/content-metadata/${id}`);
        const mapping = await fetchmapping.json();
        const tmdb = mapping.find((provider: { providerId: string; }) => provider.providerId === "tvdb").data;

        return tmdb;
    } catch (error) {
        return 0;
    }
};

