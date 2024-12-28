"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";
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

import { ScrollArea } from "../ui/scroll-area";
import { FetchEpisodes } from "@/action/fetchApi";
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
  const [videoLoading, setVideoLoading] = useState<boolean>(true); // New loading state for video player
  const [videoCardLoading, setVideoCardLoading] = useState<boolean>(true); // New loading state for VideoCard

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        const data = await FetchEpisodes(animeid || "");
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-3">
        {videoLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 h-full"
          >
            <Skeleton className="h-52 md:h-full" />
            <div className="mt-4">
              <div className="flex flex-col space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <Skeleton className="h-20 sm:h-28 w-full  mb-2 sm:mb-0" />
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
            <ScrollArea className="h-[calc(100vh-22rem)]">
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
                    {Array.from({ length: 4 }).map((_, index) => (
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
                    className="space-y-3"
                  >
                    {paginatedEpisodes.map((episode) => (
                      <EpisodeCard
                        key={episode.id}
                        episode={episode}
                        animeid={animeid}
                        isActive={activeEpisode?.id === episode.id}
                        dubParam={Boolean(dubParam)}
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
}: {
  episode: any;
  animeid: string | null;
  isActive: boolean;
  dubParam?: boolean;
}) {
  const router = useRouter();
  const handleEpisodeClick = () => {
    if (animeid) {
      // Construct the new URL with the dub parameter
      const newUrl = new URL(`/watch`, window.location.origin);
      newUrl.searchParams.set("id", animeid);
      newUrl.searchParams.set("ep", episode.number.toString());
      if (dubParam) {
        newUrl.searchParams.set("dub", dubParam.toString()); // Add dub parameter if it exists
      }
      router.push(newUrl.toString()); // Navigate to the new URL
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`group relative overflow-hidden rounded-lg bg-card transition-colors cursor-pointer border border-border ${
        isActive ? "bg-accent" : "hover:bg-accent"
      }`}
    >
      <div className="flex gap-4 p-4" onClick={handleEpisodeClick}>
        <div className="relative flex-shrink-0">
          <Image
            src={episode.img}
            alt={episode.title || `Episode ${episode.number}`}
            width={180}
            height={100}
            className="rounded-md object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-0.5 rounded text-xs font-medium">
            EP {episode.number}
          </div>
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-semibold text-lg line-clamp-1">
            {episode.title || `Episode ${episode.number}`}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {episode.description || "No description available"}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{episode.rating || "Release date unavailable"}</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
