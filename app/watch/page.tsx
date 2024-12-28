import { Recommendations } from "@/components/watch/Recommendations";
import { AnimeTabs } from "@/components/watch/Tabs";
import WatchSection from "@/components/watch/watchsection";
import { Suspense } from "react";

export default async function Anime() {
  return (
    <div className="bg-background text-foreground">
      <main className="space-y-4">
        <Suspense>
          <WatchSection />
        </Suspense>
      </main>
    </div>
  );
}
