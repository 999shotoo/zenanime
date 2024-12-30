'use server';

import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

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

