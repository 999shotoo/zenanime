

import { trending, animeinfo, advancedsearch, top100anime, seasonal, popular, Malid } from "./queries";

export interface Media {
    id: number;
    idMal: number;
    title: {
        romaji: string;
        english: string;
        userPreferred: string;
    };
    coverImage: {
        large: string;
        extraLarge: string;
    };
    bannerImage: string;
    description: string;
    format: string;
    episodes: number;
    status: string;
    genres: string[];
    averageScore: number;
    nextAiringEpisode?: {
        episode: number;
        airingAt: number;
    };
    studios?: {
        nodes: {
            name: string;
        }[];
    };
    startDate?: {
        year: number;
        month: number;
        day: number;
    };
    endDate?: {
        year: number;
        month: number;
        day: number;
    };
    season?: string;
    seasonYear?: number;
    duration?: number;
    source?: string;
}

interface PageResponse<T> {
    data: {
        Page: {
            media: T[];
        };
    };
}

export const TrendingAnilist = async (): Promise<Media[] | undefined> => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            next: { revalidate: 3600 },
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: trending,
                variables: {
                    page: 1,
                    perPage: 15,
                },
            }),
        });

        const data: PageResponse<Media> = await response.json();
        return data.data.Page.media;
    } catch (error) {
        console.error('Error fetching data from AniList:', error);
    }
}

export const PopularAnilist = async (page: number = 1): Promise<Media[] | undefined> => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            next: { revalidate: 3600 },
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: popular,
                variables: {
                    page: page,
                    perPage: page === 1 ? 40 : 10,
                },
            }),
        });

        const data: PageResponse<Media> = await response.json();
        return data.data.Page.media;
    } catch (error) {
        console.error('Error fetching popular data from AniList:', error);
    }
}

export const Top100Anilist = async (): Promise<Media[] | undefined> => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            next: { revalidate: 3600 },
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: top100anime,
                variables: {
                    page: 1,
                    perPage: 30,
                },
            }),
        });

        const data: PageResponse<Media> = await response.json();
        return data.data.Page.media;
    } catch (error) {
        console.error('Error fetching data from AniList:', error);
    }
}

export const SeasonalAnilist = async (): Promise<Media[] | undefined> => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            next: { revalidate: 3600 },
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: seasonal,
                variables: {
                    page: 1,
                    perPage: 29,
                },
            }),
        });

        const data: PageResponse<Media> = await response.json();
        return data.data.Page.media;
    } catch (error) {
        console.error('Error fetching data from AniList:', error);
    }
}

export const AnimeInfoAnilist = async (animeid: number): Promise<Media | undefined> => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            next: { revalidate: 3600 },
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: animeinfo,
                variables: {
                    id: animeid,
                },
            }),
        });

        const data: { data: { Media: Media } } = await response.json();
        return data.data.Media;
    } catch (error) {
        console.error('Error fetching data from AniList:', error);
    }
}

export const getMalID = async (animeid: number): Promise<Media | undefined> => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            next: { revalidate: 3600 },
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: Malid,
                variables: {
                    id: animeid,
                },
            }),
        });

        const data: { data: { Media: Media } } = await response.json();
        return data.data.Media;
    } catch (error) {
        console.error('Error fetching data from AniList:', error);
    }
}

export const AdvancedSearch = async (
    searchvalue: string,
    seasonvalue: string | null = null,
    formatvalue: string | null = null,
    genrevalue: string | null = null,
    statusvalue: string | null = null,
    sortbyvalue: string | null = null,
    currentPage: number = 1,
    country: string | null = null,
    startYear: number | null = null,
    episodes: number | null = null,
    selectedYear: number | null = null
): Promise<PageResponse<Media> | undefined> => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            next: { revalidate: 3600 },
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: advancedsearch,
                variables: {
                    ...(searchvalue && {
                        search: searchvalue,
                        ...(!sortbyvalue && { sort: "SEARCH_MATCH" }),
                    }),
                    type: "ANIME",
                    isAdult: false,
                    ...(selectedYear && { seasonYear: selectedYear }),
                    ...(statusvalue && { status: statusvalue }),
                    ...(seasonvalue && { season: seasonvalue }),
                    ...(formatvalue && { format: formatvalue }),
                    ...(sortbyvalue && { sort: sortbyvalue }),
                    ...(country && { countryOfOrigin: country }),
                    ...(startYear && { startDate: startYear }),
                    ...(episodes && { episodes: episodes.toString() }),
                    ...(genrevalue && { genre: genrevalue }),
                    ...(currentPage && { page: currentPage }),
                },
            }),
        });

        const data: PageResponse<Media> = await response.json();
        return { data: { Page: { media: data.data.Page.media } } };
    } catch (error) {
        console.error('Error fetching search data from AniList:', error);
    }
};