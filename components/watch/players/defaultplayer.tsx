"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider, Poster, Track } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

export function DefaultPlayer(props: {
  src: any;
  activeEpisode: any;
  animeid: string;
}) {
  const src = props.src;
  const activeEpisode = props.activeEpisode;
  return (
    <div className=" rounded-3xl overflow-hidden">
      <MediaPlayer
        title={activeEpisode?.title || "Video Player"}
        src={`${src.sources[0].url}`}
        aspectRatio="16/9"
        className="rounded-3xl"
      >
        <MediaProvider />
        {src.tracks
          .filter((track: any) => track.kind === "captions")
          .map((track: any, index: number) => (
            <Track
              src={track.file}
              label={track.label}
              kind="subtitles"
              default={track.default ? true : undefined}
            />
          ))}
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          thumbnails={
            src.tracks.find((track: any) => track.kind === "thumbnails").file
          }
        />
      </MediaPlayer>
    </div>
  );
}
