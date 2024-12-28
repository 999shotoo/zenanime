'use server';

import { getMalID } from "@/lib/anilist/anilistapi";

export const FetchGogoAnimeId = async (id: string) => {
    if (!id) {
        return 0;
    }
    try {
        const malid = await getMalID(Number(id));
        const getgogoanimeid = await fetch(`https://api.malsync.moe/mal/anime/${malid?.idMal}`);
        const res = await getgogoanimeid.json();
        const gogoanime = res.Sites.Gogoanime;
        const gogokey = Object.keys(gogoanime)[0]; // Get the first key (ID)
        const gogoanimeId = gogoanime[gogokey].identifier; // Get the URL


        return gogoanimeId;
    } catch (error) {
        console.error("Error fetching Gogoanime ID:", error); // Log the error for debugging
        return 0;
    }
};