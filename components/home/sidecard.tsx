"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Media } from "@/lib/anilist/anilistapi";
import Image from "next/image";

interface SidebarProps {
  data: Media[];
}

export function TopAiringAnime(props: SidebarProps) {
  const animeList = props.data;
  return (
    <Card className="w-full  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <CardHeader className="p-2 pt-6">
        <CardTitle className="text-xl font-semibold">TOP 10</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-0 ">
        <div className="space-y-4 p-2 py-4">
          {animeList.map((anime, index) => (
            <div
              key={index}
              className="flex items-start gap-3 bg-card rounded-xl "
            >
              <div className="relative h-[80px] w-[60px] shrink-0 overflow-hidden rounded-md">
                <Image
                  src={anime.coverImage.large}
                  alt={anime.title.english || anime.title.userPreferred}
                  className="h-full w-full object-cover"
                  width={60}
                  height={60}
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1 my-auto">
                <h3 className="truncate text-sm font-medium leading-tight">
                  {anime.title.userPreferred || anime.title.english}
                </h3>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  <span>{anime.format}</span>
                  <span>{anime.seasonYear}</span>
                  <span>
                    {anime.episodes}/ {anime.duration} mim
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
