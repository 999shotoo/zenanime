"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AnimeInfoAnilist } from "@/lib/anilist/anilistapi";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { X } from "lucide-react";

export default function AnimeDetails() {
  const [animeDetails, setAnimeDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useSearchParams();
  const animeid = params.get("id");

  useEffect(() => {
    async function fetchAnimeDetails() {
      setLoading(true);
      const data = await AnimeInfoAnilist(Number(animeid));
      setAnimeDetails(data);
      setLoading(false);
    }
    fetchAnimeDetails();
  }, [animeid]);

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-2 sm:p-4"
    >
      <NextEpisodeBanner nextEpisode={animeDetails?.nextAiringEpisode} />
      <Card className="bg-card p-3 sm:p-4 text-card-foreground mt-2">
        <div className="flex gap-4 md:gap-6">
          {/* Poster Image */}
          <div className="flex-shrink-0">
            <Image
              src={
                animeDetails?.coverImage.large ||
                "https://imgur.com/EI2OjoG.png"
              }
              alt={animeDetails?.title.userPreferred || "Anime Cover"}
              width={150}
              height={225}
              className="rounded-md shadow-lg md:w-[200px] md:h-[300px] object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <h1 className="text-lg md:text-2xl font-bold leading-tight mb-1">
                {animeDetails?.title.userPreferred}
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                {animeDetails?.title.native}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-[repeat(2,200px)] gap-y-3 gap-x-8 text-xs md:text-sm mb-4">
              <InfoItem label="Format" value={animeDetails?.format} />
              <InfoItem label="Episodes" value={animeDetails?.episodes} />
              <InfoItem
                label="Duration"
                value={`${animeDetails?.duration} min`}
              />
              <InfoItem label="Status" value={animeDetails?.status} />
              <InfoItem
                label="Start Date"
                value={formatDate(animeDetails?.startDate)}
              />
              <InfoItem
                label="Season"
                value={`${animeDetails?.season} ${animeDetails?.seasonYear}`}
              />
              <InfoItem
                label="Studios"
                value={animeDetails?.studios?.edges[0]?.node.name}
              />
              <InfoItem label="Country" value={animeDetails?.countryOfOrigin} />
              <InfoItem
                label="Rating"
                value={`${animeDetails?.averageScore}/100`}
              />
              <InfoItem
                label="Adult"
                value={animeDetails?.isAdult ? "Yes" : "No"}
              />
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {animeDetails?.genres?.map((genre: string) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="text-[10px] md:text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-500"
                >
                  {genre}
                </Badge>
              ))}
            </div>

            <div>
              <h2 className="text-xs md:text-sm font-medium mb-1">Synopsis</h2>
              <p className="text-xs md:text-sm text-muted-foreground leading-normal line-clamp-3">
                {animeDetails?.description?.replace(/<[^>]*>/g, "")}
              </p>
              <Link
                href={`/info?id=${animeid}`}
                className="text-yellow-500 hover:text-yellow-400 text-xs md:text-sm font-medium inline-block mt-1"
              >
                Read more
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "N/A"}</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="container mx-auto p-2 sm:p-4">
      <div className="h-8" /> {/* Space for banner */}
      <Card className="p-3 sm:p-4">
        <div className="flex gap-4 md:gap-6">
          <Skeleton className="h-[225px] w-[150px] md:h-[300px] md:w-[200px] rounded-md" />
          <div className="flex-1 space-y-4">
            <div>
              <Skeleton className="h-6 md:h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 md:h-5 w-1/2" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-[repeat(2,200px)] gap-y-3 gap-x-8">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-baseline justify-between gap-2"
                >
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-16 rounded-full" />
              ))}
            </div>
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface NextEpisodeBannerProps {
  nextEpisode: {
    episode: number;
    timeUntilAiring: number;
  } | null;
}

export function NextEpisodeBanner({ nextEpisode }: NextEpisodeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !nextEpisode) return null;

  const days = Math.floor(nextEpisode.timeUntilAiring / (60 * 60 * 24));
  const hours = Math.floor(
    (nextEpisode.timeUntilAiring % (60 * 60 * 24)) / (60 * 60)
  );

  return (
    <div className="relative bg-yellow-500/10 text-yellow-500 py-2 px-4 text-center text-xs md:text-sm">
      <span>
        📺 Episode {nextEpisode.episode} arrives in {days}d {hours}h
      </span>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-yellow-500/10 rounded-full"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </button>
    </div>
  );
}

export function formatDate(date: {
  year?: number;
  month?: number;
  day?: number;
}) {
  if (!date?.year) return "TBA";

  const dateObj = new Date(date.year, (date.month || 1) - 1, date.day || 1);
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
