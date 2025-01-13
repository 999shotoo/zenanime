import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

interface Anime {
  id: number;
  title: { userPreferred: string; english: string };
  title_english: string;
  coverImage: { large: string };
  format: string;
  episodes: number;
}

export default function AnimeCards(props: { anime: Anime }) {
  const anime = props.anime;
  if (!anime) return null;
  return (
    <>
      <div className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <Link className="block" href={`/watch?id=${anime.id}`}>
          <div className="relative w-full pt-[133.33%]">
            <Image
              alt={anime.title.userPreferred || anime.title_english}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
              src={anime.coverImage.large || "/image_not_found.jpg"}
              width={200}
              height={267}
            />
          </div>
          <div className="py-3">
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
    </>
  );
}

export function AnimeCardsSkeleton() {
  return (
    <div className="rounded-lg shadow-lg overflow-hidden">
      <div className="relative w-full pt-[133.33%]">
        <Skeleton className="absolute top-0 left-0 w-full h-full rounded-lg" />
      </div>
      <div className="py-3">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <div className="flex gap-2 text-xs sm:text-sm mt-1">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
}
