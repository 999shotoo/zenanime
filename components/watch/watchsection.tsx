"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Calendar, LayoutGrid, List, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

import { ScrollArea } from "../ui/scroll-area";
import { VideoPlayer } from "./playersection";

const EPISODES_PER_PAGE = 100;

export default function WatchSection() {
  const params = useSearchParams();
  const animeid = params.get("id");
  const episodeNumberParam = params.get("ep");
  const dubParam = params.get("dub");
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const [activeEpisode, setActiveEpisode] = useState<any>(null);
  const [videoLoading, setVideoLoading] = useState<boolean>(true);
  const [videoCardLoading, setVideoCardLoading] = useState<boolean>(true);
  const [layout, setLayout] = useState<"numbers" | "titles" | "thumbnails">(
    () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth >= 1024) return "thumbnails";
        if (window.innerWidth >= 768) return "titles";
        return "numbers";
      }
      return "numbers";
    }
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        const headers = new Headers();
        headers.append("x-zen", process.env.NEXT_PUBLIC_ZENANIME_API_KEY || "");
        const fetchdata = await fetch(
          `${process.env.NEXT_PUBLIC_ZENANIME_API_URL}episodes?id=${animeid}`,
          {
            headers: headers,
          }
        );
        const data = await fetchdata.json();
        if (Array.isArray(data)) {
          const formattedEpisodes = data.map((ep) => ({
            id: ep.tvdbId, // Assuming tvdbId is unique
            number: ep.episodeNumber,
            title: ep.tvdbTitle,
            description: ep.tvdbDescription,
            img: ep.tvdbImg,
            rating: ep.rating,
            isFiller: ep.isFiller,
            zoroId: ep.zoroId,
          }));
          setEpisodes(formattedEpisodes);
        } else {
          setEpisodes([]);
        }
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
        setEpisodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [animeid]);

  const filteredEpisodes = useMemo(() => {
    return episodes.filter(
      (ep) =>
        (ep.title &&
          ep.title.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
        ep.number.toString().includes(debouncedSearch)
    );
  }, [debouncedSearch, episodes]);

  const totalPages = Math.ceil(filteredEpisodes.length / EPISODES_PER_PAGE);
  const paginatedEpisodes = useMemo(() => {
    const startIndex = (currentPage - 1) * EPISODES_PER_PAGE;
    return filteredEpisodes.slice(startIndex, startIndex + EPISODES_PER_PAGE);
  }, [filteredEpisodes, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (episodes.length > 0) {
      const episodeNumber = episodeNumberParam
        ? parseInt(episodeNumberParam)
        : 1;
      const episode =
        episodes.find((ep) => ep.number === episodeNumber) || episodes[0];
      setActiveEpisode(episode);
    }
  }, [episodeNumberParam, episodes]);

  useEffect(() => {
    if (activeEpisode) {
      setVideoLoading(true);
      setVideoCardLoading(true);
      const timer = setTimeout(() => {
        setVideoLoading(false);
        setVideoCardLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [activeEpisode]);

  const dub = dubParam === "true";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        {videoLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <Skeleton className="h-auto aspect-video" />
            <div className="mt-4">
              <div className="flex flex-col space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <Skeleton className="h-32 w-full mb-2 sm:mb-0" />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <VideoPlayer activeEpisode={activeEpisode} />
        )}
      </div>

      <div>
        <div className="bg-background ">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Filter episodes..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setLayout(
                      layout === "numbers"
                        ? "titles"
                        : layout === "titles"
                        ? "thumbnails"
                        : "numbers"
                    )
                  }
                  className="flex"
                  title="Toggle layout"
                >
                  {layout === "numbers" ? (
                    <LayoutGrid className="h-4 w-4" />
                  ) : layout === "titles" ? (
                    <List className="h-4 w-4" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {totalPages > 1 && (
                <Select
                  value={currentPage.toString()}
                  onValueChange={(value) => setCurrentPage(parseInt(value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <SelectItem key={page} value={page.toString()}>
                          {`${(page - 1) * EPISODES_PER_PAGE + 1}-${Math.min(
                            page * EPISODES_PER_PAGE,
                            filteredEpisodes.length
                          )}`}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
            <ScrollArea className="h-[calc(100vh-18rem)]">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={index} className="h-32" />
                    ))}
                  </motion.div>
                ) : paginatedEpisodes.length === 0 ? (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center p-8 text-muted-foreground"
                  >
                    No episodes found
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={
                      layout === "numbers"
                        ? "grid grid-cols-5 gap-2"
                        : "space-y-3"
                    }
                  >
                    {paginatedEpisodes.map((episode) => (
                      <EpisodeCard
                        key={episode.id}
                        episode={episode}
                        animeid={animeid}
                        isActive={activeEpisode?.number === episode.number}
                        dubParam={Boolean(dubParam)}
                        layout={layout}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

function EpisodeCard({
  episode,
  animeid,
  isActive,
  dubParam,
  layout,
}: {
  episode: any;
  animeid: string | null;
  isActive: boolean;
  dubParam?: boolean;
  layout: "numbers" | "titles" | "thumbnails";
}) {
  const router = useRouter();
  const handleEpisodeClick = () => {
    if (animeid) {
      const newUrl = new URL(`/watch`, window.location.origin);
      newUrl.searchParams.set("id", animeid);
      newUrl.searchParams.set("ep", episode.number.toString());
      if (dubParam) {
        newUrl.searchParams.set("dub", dubParam.toString());
      }
      router.push(newUrl.toString());
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`group relative overflow-hidden rounded-lg bg-card transition-colors cursor-pointer border border-border ${
        isActive ? "bg-card border-l-2 border-primary" : "hover:bg-accent"
      }`}
    >
      <div
        className={`flex ${layout === "numbers" ? "p-2" : "p-4"} ${
          layout === "titles" ? "gap-2" : "gap-4"
        }`}
        onClick={handleEpisodeClick}
      >
        {layout === "thumbnails" && (
          <div className="relative flex-shrink-0">
            <Image
              src={episode.img}
              alt={episode.title || `Episode ${episode.number}`}
              width={180}
              height={100}
              className="rounded-md object-cover aspect-video"
            />
            <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-0.5 rounded text-xs font-medium">
              EP {episode.number}
            </div>
          </div>
        )}
        <div
          className={`flex-1 min-w-0 ${
            layout === "numbers" ? "text-center" : ""
          }`}
        >
          {layout === "numbers" ? (
            <span className="text-lg font-medium">{episode.number}</span>
          ) : (
            <>
              <h3 className="font-semibold line-clamp-1">
                {`Episode ${episode.number} - ${episode.title}` ||
                  `Episode ${episode.number}`}
              </h3>
              {layout === "thumbnails" && (
                <>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {episode.description || "No description available"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{episode.rating || "Release date unavailable"}</span>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
