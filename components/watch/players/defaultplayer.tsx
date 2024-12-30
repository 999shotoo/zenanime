"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider, Track } from "@vidstack/react";
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

  // Function to generate VTT content
  const generateVTTContent = (start: number, end: number, label: string) => {
    return `WEBVTT

1
${formatTime(start)} --> ${formatTime(end)}
${label}
`;
  };

  // Function to format time in VTT format (HH:MM:SS.mmm)
  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8) + ".000"; // HH:MM:SS.mmm
  };

  // Generate VTT content for intro and outro
  const introVTT = generateVTTContent(src.intro.start, src.intro.end, "Intro");
  const outroVTT = generateVTTContent(src.outro.start, src.outro.end, "Outro");

  // Combine intro and outro into a single VTT content
  const combinedVTT = `${introVTT}\n${outroVTT}`;

  return (
    <div className="rounded-3xl overflow-hidden">
      <MediaPlayer
        title={activeEpisode?.title || "Video Player"}
        src={`${src.sources[0].url}`}
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
            src.tracks.find((track: any) => track.kind === "thumbnails").file
          }
        />
      </MediaPlayer>
    </div>
  );
}
