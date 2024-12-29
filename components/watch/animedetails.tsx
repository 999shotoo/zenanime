"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AnimeInfoAnilist } from "@/lib/anilist/anilistapi";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

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

  // Render skeleton while loading
  if (loading) {
    return <SkeletonCard />;
  }

  // Render anime details
  return (
    <Card className="bg-card p-6 text-card-foreground">
      <div className="flex flex-row gap-6">
        <Image
          src={
            animeDetails?.coverImage.large ||
            "/placeholder.svg?height=300&width=200&text=Anime+Cover"
          }
          alt={
            animeDetails?.title.userPreferred ||
            animeDetails?.title.english ||
            "Anime Cover"
          }
          width={250}
          height={200}
          className="rounded-lg hidden md:block"
        />
        <div className="space-y-4 flex-1">
          <div className="space-y-1">
            <Image
              src={animeDetails.bannerImage}
              width={1080}
              height={1920}
              alt=""
              className="rounded-lg  "
            />
            <h1 className="text-2xl font-bold">
              {animeDetails?.title.userPreferred || "Loading..."}
            </h1>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Type</div>
              <div>{animeDetails?.type || "Loading..."}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Country</div>
              <div>{animeDetails?.countryOfOrigin || "Loading..."}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Status</div>
              <div className="text-primary">
                {animeDetails?.status || "Loading..."}
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Average Score</div>
              <div className="flex items-center gap-1">
                <span>{animeDetails?.averageScore || "Loading..."}</span>
                <span className="text-muted-foreground">/100</span>
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Duration</div>
              <div>{animeDetails?.duration || "Loading..."}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Episodes</div>
              <div>{animeDetails?.episodes || "Loading..."}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SkeletonCard() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col md:flex-row gap-6"
    >
      <Skeleton className="h-[300px] w-[200px] rounded-lg" />
      <div className="space-y-4 flex-1">
        <div className="space-y-1">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <div>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
