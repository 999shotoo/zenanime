"use client";

import { PopularAnilist } from "@/lib/anilist/anilistapi";
import { useEffect, useState } from "react";
import AnimeCards, { AnimeCardsSkeleton } from "../animecard";

export default function HomePopularSection() {
  const [popular, setPopular] = useState<any[] | undefined>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      const data = await PopularAnilist();
      setPopular(data);
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
              <AnimeCards anime={anime} key={index}  />
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
