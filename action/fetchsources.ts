'use server';

import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

type AnimeServers = 'hd-1' | 'hd-2' | 'megacloud';

export async function FetchSource(id: string, dub: boolean) {
    const servers: AnimeServers[] = ['hd-1', 'hd-2'];
    let language: "sub" | "dub" | "raw" | undefined = 'sub';
    if (dub) {
        language = 'dub';
    }

    for (const server of servers) {
        try {
            const fetchurl = await hianime.getEpisodeSources(id, server, language);
            if (fetchurl) {
                if (server === 'hd-2') {
                    const proxyServerLink = 'https://renewed-georgeanne-nekonode-1aa70c0c.koyeb.app/fetch?url=';
                    fetchurl.sources = fetchurl.sources.map(source => {
                        return {
                            ...source,
                            url: proxyServerLink + encodeURIComponent(source.url)
                        };
                    });
                }
                return fetchurl;
            }
        } catch (error) {
            console.error(`Error fetching from ${server}:`, error);
        }
    }

    return null;
}