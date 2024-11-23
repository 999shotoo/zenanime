"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface AnimeTrailer {
  id: string;
  site: string;
  thumbnail: string;
  thumbnailHash: string;
}

interface Anime {
  id: string;
  malId: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  image: string;
  trailer?: AnimeTrailer;
  description: string;
  status: string;
  cover: string;
  rating: number;
  releaseDate: number;
  genres: string[];
  totalEpisodes: number;
  duration: number;
  type: string;
}

interface HomeCarouselProps {
  data: Anime[];
}

export default function HomeCarousel(props: HomeCarouselProps) {
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  const featuredAnime = props.data;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeaturedIndex((prevIndex) =>
        prevIndex === featuredAnime.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredAnime.length]);

  if (featuredAnime.length === 0) {
    return <div>No featured anime available.</div>;
  }

  const currentAnime = featuredAnime[currentFeaturedIndex];

  return (
    <section className="relative h-[40vh] md:h-[50vh] rounded-xl overflow-hidden">
      <AnimatePresence initial={false}>
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
              src={currentAnime.cover}
              alt={currentAnime.title.english}
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
            />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-background to-transparent">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2"
            >
              {currentAnime.title.english || currentAnime.title.romaji}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm md:text-base mb-4 max-w-2xl truncate"
            >
              {currentAnime.description}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex space-x-4"
            >
              <Link href={`/anime/${currentAnime.malId}`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Watch Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 md:bottom-1 left-3/4 md:left-1/2 transform -translate-x-1/2 flex space-x-2 p-2 ">
        {featuredAnime.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentFeaturedIndex ? "bg-primary" : "bg-gray-400"
            }`}
            onClick={() => {
              setCurrentFeaturedIndex(index);
            }}
          />
        ))}
      </div>
    </section>
  );
}
