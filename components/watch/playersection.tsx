"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag } from "lucide-react";
import Cookies from "js-cookie"; // Ensure you have this installed

import { DefaultPlayer } from "./players/defaultplayer";
import { FetchSource } from "@/action/fetchsources";

interface VideoPlayerProps {
  activeEpisode: any;
}

export function VideoPlayer({ activeEpisode }: VideoPlayerProps) {
  const [loading, setLoading] = useState(true);
  const [episodeData, setEpisodeData] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    return Cookies.get("language") || "sub";
  });

  const params = useSearchParams();
  const animeid = params.get("id");

  useEffect(() => {
    const fetchEpisodeData = async () => {
      if (!animeid || !activeEpisode) return;

      setLoading(true);
      try {
        const data = await FetchSource(
          activeEpisode.zoroId,
          selectedLanguage === "dub"
        );
        setEpisodeData(data);
      } catch (error) {
        console.error("Failed to fetch episode data:", error);
        setEpisodeData(null);
        setSelectedLanguage("sub");
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeData();
  }, [activeEpisode, animeid, selectedLanguage]);

  useEffect(() => {
    Cookies.set("language", selectedLanguage);
  }, [selectedLanguage]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <>
      {loading ? (
        <>
          <Skeleton className="h-auto aspect-video" />
        </>
      ) : (
        <div>
          {episodeData ? (
            <DefaultPlayer
              src={episodeData}
              activeEpisode={activeEpisode}
              animeid={animeid ?? ""}
            />
          ) : (
            <div className="flex justify-center items-center h-full aspect-video">
              <p className="text-muted-foreground">
                No video source available.
              </p>
            </div>
          )}
        </div>
      )}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Language Selector :</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => handleLanguageChange("sub")}
                className={`${
                  selectedLanguage === "sub" ? "bg-primary" : "bg-secondary"
                } text-primary-foreground`}
              >
                Sub
              </Button>
              <Button
                variant="outline"
                onClick={() => handleLanguageChange("dub")}
                className={`${
                  selectedLanguage === "dub" ? "bg-primary" : "bg-secondary"
                } text-primary-foreground`}
              >
                Dub
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Flag className="mr-2 h-4 w-4" />
              Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
