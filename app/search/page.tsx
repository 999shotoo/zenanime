"use client";

import { AdvancedSearch, Media } from "@/lib/anilist/anilistapi";
import { useEffect, useState } from "react";
import AnimeCards, { AnimeCardsSkeleton } from "@/components/animecard";
import { useSearchParams } from "next/navigation";


export default function Search() {
    const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [searchdata, setSearchdata] = useState<Media[] | undefined>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      const data = await AdvancedSearch(query);
      setSearchdata(data?.data.Page.media);
      setLoading(false);
    };
    fetchSearch();
  }, [query]);

  return (
    <>
      <div>
        <div>
          <div className="lg:col-span-3 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 py-8 gap-4">
            {loading ? (
              Array.from({ length: 21 }).map((_, index) => (
                <AnimeCardsSkeleton key={index} />
              ))
            ) : searchdata?.length ? (
              searchdata.map((anime: any, index: number) => (
                <AnimeCards anime={anime} key={index} />
              ))
            ) : (
              <div className="col-span-full text-center">
                <p>No results found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
