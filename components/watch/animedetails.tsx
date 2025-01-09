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
import { AlertTriangle, Clock, X } from "lucide-react";

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
    <div className="bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="container mx-auto space-y-2"
      >
        <NotificationBanner />
        {animeDetails?.nextAiringEpisode && (
          <EpisodeBanner nextEpisode={animeDetails.nextAiringEpisode} />
        )}
        <Card className="bg-card/50 border-border ">
          <div className="flex gap-4 p-4">
            {/* Poster Image */}
            <div className="flex-shrink-0">
              <Image
                src={
                  animeDetails?.coverImage.large ||
                  "https://imgur.com/EI2OjoG.png"
                }
                alt={animeDetails?.title.userPreferred || "Anime Cover"}
                width={120}
                height={180}
                className="rounded shadow-lg object-cover"
                priority
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <h1 className="text-base font-medium leading-tight mb-0.5">
                  {animeDetails?.title.userPreferred}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {animeDetails?.title.native}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4 text-xs">
                <InfoItem label="Format" value={animeDetails?.format} />
                <InfoItem label="Episodes" value={animeDetails?.episodes} />
                <InfoItem
                  label="Duration"
                  value={`${animeDetails?.duration} min`}
                />
                <InfoItem label="Status" value={animeDetails?.status} />
                <InfoItem
                  label="Studios"
                  value={animeDetails?.studios?.edges[0]?.node.name}
                />
                <InfoItem
                  label="Season"
                  value={`${animeDetails?.season} ${animeDetails?.seasonYear}`}
                />
                <InfoItem
                  label="Rating"
                  value={`${animeDetails?.averageScore}/100`}
                />
                <InfoItem
                  label="Country"
                  value={animeDetails?.countryOfOrigin}
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {animeDetails?.genres?.slice(0, 4).map((genre: string) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0.5"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>

              <div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {animeDetails?.description?.replace(/<[^>]*>/g, "")}
                </p>
                <Link
                  href={`/info?id=${animeid}`}
                  className="text-primary hover:text-primary/90 text-xs font-medium inline-block mt-1"
                >
                  Read more
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
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
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-right truncate">{value || "N/A"}</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-background">
      <div className="container mx-auto space-y-2">
        <Skeleton className="h-8 w-full" />{" "}
        {/* Space for notification banner */}
        <Skeleton className="h-8 w-full" /> {/* Space for episode banner */}
        <Card className="bg-card/50 border-border">
          <div className="flex gap-4 p-4">
            {/* Poster Image Skeleton */}
            <Skeleton className="h-[180px] w-[120px] rounded" />

            {/* Content Skeleton */}
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <Skeleton className="h-5 w-3/4 mb-0.5" />
                <Skeleton className="h-3 w-1/2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-baseline justify-between gap-2"
                  >
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-12 rounded-full" />
                ))}
              </div>

              <div>
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-16 mt-1" /> {/* Read more link */}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function NotificationBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-yellow-500/5 border border-yellow-500/10 text-yellow-500 py-2 px-4 text-xs">
      <div className="flex items-center gap-2 pr-8">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>
          If the player doesn't work or keeps buffering, try{" "}
          <Link
            href="#"
            onClick={() => {
              window.location.reload();
            }}
            className="text-yellow-400 hover:underline"
          >
            refreshing the page
          </Link>
          .
        </span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-yellow-500/10 rounded-full"
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Dismiss</span>
      </button>
    </div>
  );
}

interface EpisodeBannerProps {
  nextEpisode: {
    episode: number;
    timeUntilAiring: number;
  } | null;
}

export function EpisodeBanner({ nextEpisode }: EpisodeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !nextEpisode) return null;

  const days = Math.floor(nextEpisode.timeUntilAiring / (60 * 60 * 24));
  const hours = Math.floor(
    (nextEpisode.timeUntilAiring % (60 * 60 * 24)) / (60 * 60)
  );

  return (
    <div className="relative bg-primary/5 border border-primary/10 text-primary-foreground py-2 px-4 text-xs">
      <div className="flex items-center gap-2 pr-8">
        <Clock className="h-4 w-4 shrink-0" />
        <span>
          Episode {nextEpisode.episode} arrives in {days}d {hours}h
        </span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-primary/10 rounded-full"
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Dismiss</span>
      </button>
    </div>
  );
}
