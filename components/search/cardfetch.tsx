"use client";

import {
  AdvancedSearch,
  Media,
  PopularAnilist,
} from "@/lib/anilist/anilistapi";
import { useEffect, useState } from "react";
import AnimeCards, { AnimeCardsSkeleton } from "../animecard";
import { useSearchParams } from "next/navigation";

export default function SearchCards() {
  const [popular, setPopular] = useState<Media[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPopular = async () => {
      const search = searchParams.get("query");
      setLoading(true);
      const data = await AdvancedSearch(search as string);
      setPopular(data?.data.Page.media);
      setLoading(false);
    };
    fetchPopular();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <>
      <div className="lg:col-span-3 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 py-8 gap-4">
        {loading ? (
          Array.from({ length: 14 }).map((_, index) => (
            <AnimeCardsSkeleton key={index} />
          ))
        ) : popular?.length ? (
          popular.map((anime: any, index: number) => (
            <AnimeCards anime={anime} key={index} />
          ))
        ) : (
          <div className="col-span-full text-center">
            <p>No results found.</p>
          </div>
        )}
      </div>
    </>
  );
}
