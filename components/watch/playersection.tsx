"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag } from "lucide-react";
import Cookies from "js-cookie"; // Ensure you have this installed
import { FetchSource } from "@/action/fetchApi";
import { DefaultPlayer } from "./players/defaultplayer";

interface VideoPlayerProps {
  activeEpisode: any;
}

export function VideoPlayer({ activeEpisode }: VideoPlayerProps) {
  const [loading, setLoading] = useState(true);
  const [episodeData, setEpisodeData] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    // Get the language from cookies, default to "sub"
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
          activeEpisode.id,
          selectedLanguage === "dub"
        );
        setEpisodeData(data); // Store the full episode data
      } catch (error) {
        console.error("Failed to fetch episode data:", error);
        setEpisodeData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeData(); // Call fetch function
  }, [activeEpisode, animeid, selectedLanguage]); // Dependencies include parameters

  useEffect(() => {
    // Update cookies when language changes
    Cookies.set("language", selectedLanguage);
  }, [selectedLanguage]);

  const handleLanguageChange = (language: string) => {
    if (language === "dub" && !activeEpisode.hasDub) {
      return;
    }
    setSelectedLanguage(language);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-52 md:h-full">
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        <div>
          {episodeData ? (
            <DefaultPlayer src={episodeData} activeEpisode={activeEpisode} />
          ) : (
            <div className="flex justify-center items-center h-full">
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
                disabled={!activeEpisode.hasDub}
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
