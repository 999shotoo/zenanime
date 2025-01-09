"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Star, Tv } from "lucide-react";
import { getRecommendations, Media } from "@/lib/anilist/anilistapi";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export function Recommendations() {
  const searchParams = useSearchParams();
  const animeId = Number(searchParams.get("id"));
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<
    Media["recommendations"]["nodes"]
  >([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true); // Set loading to true before fetching
      const data = await getRecommendations(animeId);
      if (data) {
        setRecommendations(data.recommendations.nodes);
      }
      setLoading(false); // Set loading to false after fetching
    };

    fetchRecommendations();
  }, [animeId]);

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm font-medium tracking-wide">
          {loading ? (
            <Skeleton className="h-6 w-48" /> // Skeleton for the title
          ) : (
            "RECOMMENDATIONS"
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className=" h-[500px] px-6">
          <div className="space-y-4 pb-4">
            {loading // Conditional rendering based on loading state
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-3 rounded-md p-2"
                  >
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  </div>
                ))
              : recommendations.map((recommendation) => {
                  const anime = recommendation.mediaRecommendation;
                  return (
                    <div
                      key={anime.id}
                      className="group flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-white/5 hover:cursor-pointer"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        router.push(`/watch?id=${anime.id}`);
                      }}
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={anime.coverImage.medium}
                          alt={anime.title.userPreferred}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1 overflow-hidden">
                        <h3 className="truncate text-sm font-medium group-hover:text-blue-400">
                          {anime.title.userPreferred}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Tv className="h-3 w-3" />
                            <span>{anime.format}</span>
                          </div>
                          {anime.episodes && (
                            <div className="flex items-center gap-1">
                              <span>{anime.episodes} eps</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>75</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
