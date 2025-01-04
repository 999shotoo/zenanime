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
import { cn } from "@/lib/utils";
import { FetchEpisodesAll } from "@/action/fetchepisodes";

const EPISODES_PER_PAGE = 100;

function ThumbnailSkeleton() {
  return (
    <div className="flex gap-3 p-2 bg-background/5 rounded-lg">
      <Skeleton className="h-[80px] w-[120px] rounded-md flex-shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

function TitleSkeleton() {
  return (
    <div className="px-4 py-2.5 bg-background/5 rounded-lg">
      <Skeleton className="h-5 w-full" />
    </div>
  );
}

function NumberSkeleton() {
  return <div className="aspect-square bg-background/5 rounded-lg" />;
}

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
  const [layout, setLayout] = useState<"numbers" | "titles" | "thumbnails">(
    "thumbnails"
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      if (!animeid) return; // Early return if animeid is not available

      try {
        const data = await FetchEpisodesAll(animeid);
        if (Array.isArray(data)) {
          setEpisodes(data);
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
    return episodes.filter((ep) => {
      const titleMatch =
        ep.tvdbTitle &&
        ep.tvdbTitle.toLowerCase().includes(debouncedSearch.toLowerCase());
      const numberMatch =
        ep.episodeNumber &&
        ep.episodeNumber.toString().includes(debouncedSearch);
      return titleMatch || numberMatch;
    });
  }, [debouncedSearch, episodes]);

  const totalPages = Math.ceil(filteredEpisodes.length / EPISODES_PER_PAGE);
  const paginatedEpisodes = useMemo(() => {
    const startIndex = (currentPage - 1) * EPISODES_PER_PAGE;
    const endIndex = startIndex + EPISODES_PER_PAGE;
    return filteredEpisodes.slice(startIndex, endIndex);
  }, [filteredEpisodes, currentPage]);

  // Reset to the first page when the search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);
  useEffect(() => {
    if (episodes.length > 0) {
      const episodeNumber = episodeNumberParam
        ? parseInt(episodeNumberParam)
        : 1;
      const episode =
        episodes.find((ep) => ep.episodeNumber === episodeNumber) ||
        episodes[0];
      setActiveEpisode(episode);
    }
  }, [episodeNumberParam, episodes]);

  useEffect(() => {
    if (activeEpisode) {
      setVideoLoading(true);
      const timer = setTimeout(() => {
        setVideoLoading(false);
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
              {/* <div className="flex gap-2">
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
              </div> */}
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
            <ScrollArea className="h-[calc(100vh-18rem)] p-2">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-1"
                  >
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index}>
                        {layout === "thumbnails" ? (
                          <ThumbnailSkeleton />
                        ) : layout === "titles" ? (
                          <TitleSkeleton />
                        ) : (
                          <NumberSkeleton />
                        )}
                      </div>
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
                        ? "grid grid-cols-5 gap-2 "
                        : "space-y"
                    }
                  >
                    {paginatedEpisodes.map((episode) => (
                      <EpisodeCard
                        key={episode.zoroId}
                        episode={episode}
                        animeid={animeid}
                        isActive={
                          activeEpisode?.episodeNumber === episode.episodeNumber
                        }
                        dubParam={Boolean(dubParam)}
                        layout={layout}
                        isWatched={false}
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
  isWatched,
  dubParam,
  layout,
}: {
  episode: any;
  animeid: string | null;
  isActive: boolean;
  isWatched: boolean;
  dubParam?: boolean;
  layout: "numbers" | "titles" | "thumbnails";
}) {
  const router = useRouter();
  const handleEpisodeClick = () => {
    if (animeid) {
      const newUrl = new URL(`/watch`, window.location.origin);
      newUrl.searchParams.set("id", animeid);
      newUrl.searchParams.set("ep", episode.episodeNumber.toString());
      if (dubParam) {
        newUrl.searchParams.set("dub", dubParam.toString());
      }
      router.push(newUrl.toString());
    }
  };

  if (layout === "numbers") {
    return (
      <motion.button
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleEpisodeClick}
        className={cn(
          "rounded p-2 flex items-center justify-center transition-colors",
          isActive && "bg-primary",
          isWatched && !isActive && "bg-sage-500/20 text-sage-500",
          !isActive && !isWatched && "hover:bg-accent"
        )}
      >
        {episode.episodeNumber}
      </motion.button>
    );
  }

  if (layout === "titles") {
    return (
      <motion.button
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleEpisodeClick}
        className={cn(
          "w-full px-4 py-2.5 text-left text-sm transition-colors rounded",
          isActive && "bg-primary",
          isWatched && !isActive && "text-sage-500",
          !isActive && !isWatched && "hover:bg-accent"
        )}
      >
        {episode.episodeNumber}.{" "}
        {episode.tvdbTitle || `Episode ${episode.episodeNumber}`}
      </motion.button>
    );
  }

  return (
    <motion.button
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleEpisodeClick}
      className={cn(
        "flex gap-3 p-2 text-left transition-colors rounded-lg",
        isActive && "border-primary border-2",
        !isActive && "hover:bg-accent"
      )}
    >
      <div className="relative flex-shrink-0">
        <Image
          src={episode.tvdbImg}
          alt={episode.tvdbTitle || `Episode ${episode.episodeNumber}`}
          width={120}
          height={80}
          className="rounded object-cover w-[120px] h-[80px]"
        />
        <div className="absolute top-1 left-1 bg-black px-1.5 py-0.5 rounded text-[10px] font-medium">
          EP {episode.episodeNumber}
        </div>
      </div>
      <div className="flex-1 min-w-0 py-1">
        <h3 className="font-medium line-clamp-1 text-sm">
          {episode.tvdbTitle || `Episode ${episode.episodeNumber}`}
        </h3>
        <p className="line-clamp-2 text-xs text-muted-foreground mt-1">
          {episode.tvdbDescription || "No description available"}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">
            {episode.rating || "Release date unavailable"}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
