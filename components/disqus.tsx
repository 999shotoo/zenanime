"use client";

import { DiscussionEmbed } from "disqus-react";
import { useTheme } from "next-themes";
import React from "react";

function DisqusComments() {
  const { theme } = useTheme();
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const disqusConfig = {
    url: pageUrl,
    identifier: "post.slug,",
  };
  return (
    <>
      <div className="p-8 my-4 bg-card border rounded-2xl">
        <DiscussionEmbed
          key={theme}
          shortname="animixwatch"
          config={disqusConfig}
        />
      </div>
    </>
  );
}

export default DisqusComments;
