import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

export default function AnimeCards(props: { data: any }) {
  const animeList = props.data;

  return (
    <>
      <div className="grid grid-cols-2  md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-7 gap-4 ">
        {animeList.length > 0 ? (
          animeList.map((anime: any, index: number) => (
            <div key={index} className="rounded-lg shadow-lg overflow-hidden ">
              <Link className="block" href={`/anime/${anime.mal_id}/1`}>
                <Image
                  alt="Anime 1"
                  className="w-full h-[250px] object-cover rounded-lg"
                  height={400}
                  src={anime.images.webp.large_image_url || "/image_not_found"}
                  style={{
                    aspectRatio: "300/400",
                    objectFit: "cover",
                  }}
                  width={300}
                />
                <div className="p-1">
                  <h3 className="text-lg font-semibold truncate">
                    {anime.title || anime.title_english}
                  </h3>
                  <p className="flex gap-2 text-sm">
                    <span className="text-orange-700">{anime.type}</span>•
                    <span>{anime.episodes} EPS</span>
                  </p>
                </div>
              </Link>
            </div>
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
