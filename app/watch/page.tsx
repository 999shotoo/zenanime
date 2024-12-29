import DisqusComments from "@/components/disqus";
import AnimeDetails from "@/components/watch/animedetails";
import { Recommendations } from "@/components/watch/Recommendations";
import WatchSection from "@/components/watch/watchsection";

import { Suspense } from "react";

export default async function Anime() {
  return (
    <div className="bg-background text-foreground">
      <main className="space-y-4">
        <div>
          <Suspense>
            <WatchSection />
          </Suspense>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-3 lg:col-span-2">
            <AnimeDetails />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <Recommendations />
          </div>
          <div className="col-span-2">
            <DisqusComments />
          </div>
        </div>
      </main>
    </div>
  );
}
