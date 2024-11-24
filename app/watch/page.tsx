import fetchEpisodes from "@/actions/fetch/fetchepisodes";
import { fetchInfo } from "@/actions/fetch/fetchinfo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { redirect } from "next/navigation";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { a } from "framer-motion/client";
import fetchWatchUrl from "@/actions/fetch/fetchwatchurl";

interface SearchParams {
  id: string;
  ep: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Watch({ searchParams }: PageProps) {
  const params = await searchParams;
  if (!params.ep) {
    redirect(`/watch?id=${params.id}&ep=1`);
  }
  const animeinfo = await fetchInfo(params.id);
  if (!animeinfo) {
    return <div>Not Found</div>;
  }
  const zoroeps = await fetchEpisodes(params.id);
  const activeEpisode = zoroeps?.find(
    (episode: { number: number }) =>
      episode.number === parseInt(String(params.ep))
  );
  if (!activeEpisode) {
    console.log("Not Found");
  }
  const activeepsurlzoro = await fetchWatchUrl(activeEpisode?.episodeId ?? "");

  return (
    <>
      <div className="min-h-screen text-foreground">
        <div className="container mx-auto p-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_250px]">
            <div className="space-y-4 order-1">
              <div className="rounded-lg relative">
                <MediaPlayer
                  title={`loading`}
                  src={activeepsurlzoro?.sources[0].url}
                >
                  <MediaProvider />
                  <DefaultVideoLayout icons={defaultLayoutIcons} />
                </MediaPlayer>
              </div>
            </div>
            <div className="rounded-lg p-2 order-2 bg-muted/40">
              <ScrollArea className="h-[60vh]">
                <div className="grid grid-cols-5 gap-1">
                  {zoroeps?.map((episode: any) => (
                    <Link href={`/watch?id=${params.id}&ep=${episode.number}`}>
                      <Button
                        key={episode.id}
                        variant="ghost"
                        size="sm"
                        className={`h-7 text-xs ${
                          episode.number === Number(params.ep)
                            ? "bg-primary hover:bg-primary/90 text-background"
                            : "hover:bg-primary/90"
                        }`}
                      >
                        {episode.number}
                      </Button>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <div className="mt-6 bg-muted/40 rounded-lg p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-[200px] shrink-0">
                <Image
                  src={animeinfo.cover}
                  alt={animeinfo.title}
                  width={200}
                  height={300}
                  className="rounded-lg w-full h-auto"
                />
                <Link href={`/anime/${params.id}/1`}>
                  <Button className="w-full mt-4 bg-primary">
                    <Play className="h-4 w-4 mr-2" /> Watch now
                  </Button>
                </Link>
                <Button variant="outline" className="w-full mt-2">
                  + Add to List
                </Button>
              </div>
              <div className="flex-1">
                <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                  <Link href="/" className="hover:text-foreground">
                    Home
                  </Link>
                  <span>•</span>
                  <Link href="/tv" className="hover:text-foreground">
                    {animeinfo.type}
                  </Link>
                  <span>•</span>
                  <span>{animeinfo.title}</span>
                </nav>

                <h2 className="text-3xl font-bold mb-4">{animeinfo.title}</h2>

                <div className="flex flex-wrap gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Score:</span>
                    <span className="text-primary">9.24</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    {/* <Select defaultValue="watching">
                      <SelectTrigger className="h-7 w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="watching">Watching</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="dropped">Dropped</SelectItem>
                      </SelectContent>
                    </Select> */}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Episode:</span>
                    <span>122/1000+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Your Score:</span>
                    {/* <Select defaultValue="not-rated">
                      <SelectTrigger className="h-7 w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-rated">Not rated</SelectItem>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select> */}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <Badge variant="outline">PG-13</Badge>
                  <Badge className="bg-primary">HD</Badge>
                  <div className="flex items-center">
                    <Badge variant="outline">★ 4</Badge>
                    <Badge variant="outline">↑ 2</Badge>
                    <Badge variant="outline">⚡ 12</Badge>
                  </div>
                  <Badge variant="outline">{animeinfo.type}</Badge>
                  <Badge variant="outline">{animeinfo.episode}</Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  {animeinfo.synopsis}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-4">
          <h3 className="font-bold mb-4">Related Episodes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-video bg-card rounded-lg relative group">
                  <Image
                    src="/placeholder.svg"
                    alt={`Episode ${i + 1}`}
                    layout="fill"
                    className="rounded-lg object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary">HD</Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-medium truncate">Episode {i + 1}</p>
                  <p className="text-xs text-muted-foreground">SUB | DUB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
