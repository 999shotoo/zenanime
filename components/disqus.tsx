"use client";

import { DiscussionEmbed } from "disqus-react";
import { useTheme } from "next-themes";
import React, { use, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import { useSearchParams } from "next/navigation";

function DisqusComments() {
  const { theme } = useTheme();
  const params = useSearchParams();
  const animeid = params.get("id");
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const disqusConfig = {
    url: pageUrl,
    identifier: animeid ?? "",
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 my-4 bg-card border rounded-2xl">
      {loading ? (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <DiscussionEmbed
          key={theme}
          shortname="animixwatch"
          config={disqusConfig}
        />
      )}
    </div>
  );
}

export default DisqusComments;
