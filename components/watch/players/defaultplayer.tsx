"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider, Track } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { useEffect, useState } from "react";

export function DefaultPlayer(props: {
  src: any;
  activeEpisode: any;
  animeid: string;
}) {
  const src = props.src;
  const activeEpisode = props.activeEpisode;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const generateVTTContent = (start: number, end: number, label: string) => {
    return `WEBVTT

1
${formatTime(start)} --> ${formatTime(end)}
${label}
`;
  };

  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8) + ".000";
  };

  const introVTT = generateVTTContent(src.intro.start, src.intro.end, "Intro");
  const outroVTT = generateVTTContent(src.outro.start, src.outro.end, "Outro");
  const combinedVTT = `${introVTT}\n${outroVTT}`;

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-3xl overflow-hidden">
      <MediaPlayer
        title={activeEpisode.title}
        src={src.sources.length > 0 ? src.sources[0].url : ""}
        aspectRatio="16/9"
        className="rounded-3xl"
        autoPlay={true}
      >
        <MediaProvider />
        {src.tracks
          .filter((track: any) => track.kind === "captions")
          .map((track: any, index: number) => (
            <Track
              src={track.file}
              label={track.label}
              kind="subtitles"
              default={track.default ? true : false}
            />
          ))}
        <Track
          content={combinedVTT}
          kind="chapters"
          type="vtt"
          default={true}
        />
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          thumbnails={
            src.tracks.find((track: any) => track.kind === "thumbnails")
              ?.file || "/placeholder.svg"
          }
        />
      </MediaPlayer>
    </div>
  );
}
