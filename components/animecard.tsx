import Link from "next/link";
import Image from "next/image";

export default function AnimeCards(props: { data: any[] }) {
  const animeList = props.data;

  return (
    <>
      {animeList.length > 0 ? (
        animeList.map((anime: any, index: number) => (
          <div
            key={index}
            className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <Link className="block" href={`/watch/${anime.id}/1`}>
              <div className="relative w-full pt-[133.33%]">
                {" "}
                {/* 3:4 aspect ratio */}
                <Image
                  alt={anime.title.userPreferred || anime.title_english}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
                  src={anime.coverImage.large || "/image_not_found.jpg"}
                  layout="fill"
                />
              </div>
              <div className="p-3">
                <h3 className="text-base sm:text-lg font-semibold truncate">
                  {anime.title.userPreferred || anime.title_english}
                </h3>
                <p className="flex gap-2 text-xs sm:text-sm mt-1">
                  <span className="text-orange-700">{anime.format}</span>•
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
    </>
  );
}
