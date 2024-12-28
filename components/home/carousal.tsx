"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Info,
  Play,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  MonitorPlay,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import { Media, PopularAnilist } from "@/lib/anilist/anilistapi";

export default function HomeCarousel() {
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [featuredAnime, setFeaturedAnime] = useState<Media[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [showCarousel, setShowCarousel] = useState(false); // New state for carousel visibility
  const [error, setError] = useState<string | null>(null); // New state for error handling

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await PopularAnilist(1);
        setFeaturedAnime(response);
      } catch (error) {
        console.error("Failed to fetch anime data:", error);
        setError("Failed to load featured anime. Please try again later."); // Set error message
      } finally {
        setLoading(false);
        setShowCarousel(true); // Show carousel after loading
      }
    };

    fetchAnimeData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeaturedIndex((prevIndex) =>
        prevIndex === (featuredAnime?.length ?? 0) - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredAnime?.length ?? 0]);

  if (loading) {
    return (
      <section className="relative h-[40vh] md:h-[50vh] rounded-xl overflow-hidden">
        <Skeleton className="h-full w-full rounded-md" />
      </section>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (featuredAnime && featuredAnime.length === 0) {
    return <div>No featured anime available.</div>;
  }

  const currentAnime = featuredAnime?.[currentFeaturedIndex] ?? null;

  const handlePrev = () => {
    setCurrentFeaturedIndex((prevIndex) =>
      prevIndex === 0 ? (featuredAnime?.length ?? 0) - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentFeaturedIndex((prevIndex) =>
      prevIndex === (featuredAnime?.length ?? 0) - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="relative h-[40vh] md:h-[50vh] rounded-xl overflow-hidden">
      <AnimatePresence>
        {showCarousel && ( // Only render the carousel if showCarousel is true
          <motion.div
            key={currentFeaturedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0">
              <Image
                src={currentAnime?.bannerImage || ""}
                alt={currentAnime?.title.english || ""}
                className="w-full h-full object-cover"
                width={1920}
                height={1080}
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 bg-gradient-to-t from-background to-transparent">
              {/* Anime Stats */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="self-end flex items-center gap-3 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm"
              >
                <div className="flex items-center gap-1.5">
                  <MonitorPlay className="h-4 w-4" />
                  <span>{currentAnime?.format || "ONA"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span>{currentAnime?.averageScore || "81"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{currentAnime?.duration || "24"} mins</span>
                </div>
              </motion.div>

              {/* Anime Title and Description */}
              <div>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2"
                >
                  {currentAnime?.title.english || currentAnime?.title.romaji}
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm md:text-base mb-4 max-w-2xl line-clamp-2"
                >
                  {currentAnime?.description.replace(/<[^>]*>/g, "")}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex space-x-4"
                >
                  <Link href={`/watch?id=${currentAnime?.id}&ep=1`}>
                    <Button size="sm" className="px-6">
                      <Play className="mr-2 h-4 w-4" /> Watch Now
                    </Button>
                  </Link>
                  <Link href={`/info/${currentAnime?.id}`}>
                    <Button size="sm" variant="outline" className="px-6">
                      <Info className="mr-2 h-4 w-4" /> Details
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute bottom-8 right-8 space-x-3 hidden md:flex">
        <Button
          size="icon"
          variant="outline"
          onClick={handlePrev}
          className="h-8 w-8 bg-black/60 backdrop-blur-sm border-white/20 hover:bg-white/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={handleNext}
          className="h-8 w-8 bg-black/60 backdrop-blur-sm border-white/20 hover:bg-white/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
