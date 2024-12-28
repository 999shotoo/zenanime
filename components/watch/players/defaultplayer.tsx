"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function DefaultPlayer(props: { src: any; activeEpisode: any }) {
  const src = props.src;
  const activeEpisode = props.activeEpisode;
  return (
    <div className=" rounded-3xl overflow-hidden">
      <MediaPlayer
        title={activeEpisode?.title || "Video Player"}
        src={`https://prxy.miruro.to/m3u8/?url=${
          src.sources.find((s: any) => s.quality === "default")?.url
        }`}
        aspectRatio="16/9"
        className="rounded-3xl"
      >
        <MediaProvider />
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          slots={{
            downloadButton: (
              <Button variant={"ghost"}>
                <Download />
              </Button>
            ),
          }}
        />
      </MediaPlayer>
    </div>
  );
}
