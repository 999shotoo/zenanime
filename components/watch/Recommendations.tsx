"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

const recommendations = [
  {
    id: 1,
    title: "HAIKYU!!",
    type: "TV",
    episodes: 25,
    status: "Finished",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Kuroko's Basketball",
    type: "TV",
    episodes: 25,
    status: "Finished",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Hajime no Ippo: The Fighting!",
    type: "TV",
    episodes: 75,
    status: "Finished",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Ace of the Diamond",
    type: "TV",
    episodes: 25,
    status: "Finished",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    title: "Asaahi",
    type: "TV",
    episodes: 24,
    status: "Finished",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    title: "Inazuma Eleven",
    type: "TV",
    episodes: 127,
    status: "Finished",
    image: "/placeholder.svg",
  },
];

export function Recommendations() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((anime) => (
            <div
              key={anime.id}
              className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg cursor-pointer"
            >
              <Image
                src={anime.image}
                alt={anime.title}
                width={50}
                height={70}
                className="rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{anime.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {anime.type} • {anime.episodes} Episodes • {anime.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
